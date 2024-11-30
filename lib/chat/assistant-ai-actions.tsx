import 'server-only';

import { ReactNode } from 'react';

import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import {
  AIMessage,
  AIMessageChunk,
  ChatMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { generateId } from 'ai';
import {
  createAI,
  createStreamableUI,
  getAIState,
  getMutableAIState,
} from 'ai/rsc';
import { createRetrieverTool } from 'langchain/tools/retriever';

import { auth, SessionUserData } from '@/auth';
import { BotMessage, BotSpinnerMessage } from '@/components/chat-messages';
import { saveChat, setCurrentUserActiveChat } from '@/lib/server-actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Chat, Message, MessageToolCall } from '@/lib/types';

import { langsmithClient } from '../langsmith';
import { pullPrompt, systemAssistantChatBotPromptTemplate } from '../prompts';
import { getUIStateFromAIState } from './utils';

export type ServerMessage = Message;

export type ClientMessage = Omit<Message, 'content'> & {
  display: ReactNode;
};

export type AssistantAIState = {
  id: string;
  messages: ServerMessage[];
};

export type AssistantUIState = {
  id: string;
  messages: ClientMessage[];
};

export type AssistantActions = {
  // // @deprecated for usage reference only
  // submitUserMessageToLangchainRunanle: (
  //   content: string,
  // ) => Promise<ClientMessage>;
  submitUserMessageToLangchainAgent: (
    content: string,
  ) => Promise<ClientMessage>;
  // // @deprecated for usage reference only
  // submitUserMessageToLLMWithTool: (content: string) => Promise<ClientMessage>;
};

// // @deprecated for usage reference only
// export async function submitUserMessageToLangchainRunanle(
//   message: string,
// ): Promise<ClientMessage> {
//   'use server';

//   const session = await auth();

//   if (!session?.user) {
//     throw 'Session not found';
//   }

//   const aiState = getMutableAIState<typeof AssistantAIProvider>();

//   const userMessage: Message = {
//     id: generateId(),
//     role: 'user',
//     content: message,
//   };

//   aiState.update({
//     ...aiState.get(),
//     messages: [...aiState.get().messages, userMessage],
//   });

//   let assistantMessageContent: string = '';
//   const textStream = createStreamableValue('');

//   const stream = await RunnableSequence.from([
//     PromptTemplate.fromTemplate<{
//       chat_history: string;
//       lastest_message: string;
//     }>(`You are an AI Assistant chatbot. Just answer the user question.

// <chat_history>
// {chat_history}
// </chat_history>

// Latest user message: {lastest_message}`),
//     llm,
//     new StringOutputParser(),
//   ]).stream({
//     chat_history: '',
//     lastest_message: message,
//   });

//   const assistantMessageId = generateId();

//   // noinspection ES6MissingAwait
//   (async () => {
//     for await (const chainStreamChunk of stream) {
//       const text = chainStreamChunk;
//       assistantMessageContent += text;
//       textStream.update(text);
//     }

//     const assistantMessage: Message = {
//       id: assistantMessageId,
//       role: 'assistant',
//       content: assistantMessageContent,
//     };

//     textStream.done();
//     aiState.done({
//       ...aiState.get(),
//       messages: [...aiState.get().messages, assistantMessage],
//     });
//   })();

//   return {
//     id: assistantMessageId,
//     role: 'assistant',
//     display: <BotMessage content={textStream.value} />,
//   };
// }

export async function submitUserMessageToLangchainAgent(
  message: string,
): Promise<ClientMessage> {
  'use server';

  const session = await auth();

  if (!session?.user) {
    throw 'Session not found';
  }

  const aiState = getMutableAIState<typeof AssistantAIProvider>();

  const userMessage: Message = {
    id: generateId(),
    role: 'user',
    content: message,
  };

  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages, userMessage],
  });

  const tracer = new LangChainTracer({
    client: langsmithClient,
    projectName: process.env.LANGCHAIN_PROJECT,
  });

  const chatModel = new ChatOpenAI({
    model: process.env.LLM_MODEL_CHAT,
    temperature: 0.2,
    // callbacks: [tracer],
  });

  const wikipediaTool = new WikipediaQueryRun({
    topKResults: 3,
    maxDocContentLength: 4000,
  });

  const supabaseClient = createSupabaseServerClient();
  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client: supabaseClient,
    tableName: 'document_chunks',
    queryName: 'match_document_chunks',
  });
  const retriever = vectorStore.asRetriever();
  const retrieverTool = createRetrieverTool(retriever, {
    name: 'database_knowledge_retriever',
    description:
      'Searches and returns up-to-date general information from user uploaded document chunks from a database.',
  });

  const systemPromptTemplate = await pullPrompt(
    'system_assistant_prompt_template',
    systemAssistantChatBotPromptTemplate,
  );
  const systemPrompt = await systemPromptTemplate.format({});

  let runId: string | undefined = undefined;

  const agent = createReactAgent({
    llm: chatModel,
    tools: [wikipediaTool, retrieverTool],
    messageModifier: new SystemMessage(systemPrompt),
  }).withConfig({
    callbacks: [tracer],
    configurable: {
      thread_id: aiState.get().id,
      user_id: (session.user as SessionUserData)?.id,
      username: (session.user as SessionUserData)?.username,
      user_email: (session.user as SessionUserData)?.email,
    },
  });

  const eventStream = agent.streamEvents(
    { messages: aiState.get().messages.map(convertMessageToLangChainMessage) },
    { version: 'v2' },
  );

  const uiStream = createStreamableUI(
    <BotSpinnerMessage>Thinking...</BotSpinnerMessage>,
  );
  const assistantMessageId = generateId();
  let assistantMessageContent: string = '';
  let usedTools: MessageToolCall[] = [];

  // noinspection ES6MissingAwait
  (async () => {
    let currentName: string | undefined = undefined;
    let currentMessage: string | undefined = undefined;

    for await (const agentStreamChunk of eventStream) {
      const { name, event, data } = agentStreamChunk;

      if (name !== currentName) {
        currentName = name;
      }

      try {
        // console.log(`[${currentName}] ${event}`);
        switch (currentName) {
          case 'LangGraph': {
            if (event === 'on_chain_start') {
              runId = agentStreamChunk.run_id;
            }
            break;
          }
          case 'WikipediaQueryRun':
            switch (event) {
              case 'on_tool_start':
                uiStream.update(
                  <BotSpinnerMessage>AI thinking...</BotSpinnerMessage>,
                );
                break;
              case 'on_tool_end':
                usedTools.push({
                  id: (data.output as ToolMessage).tool_call_id,
                  name: currentName,
                  input: (data as any).input.input,
                  output: (data.output as ToolMessage).content as any,
                });
                uiStream.update(
                  <BotSpinnerMessage>AI thinking...</BotSpinnerMessage>,
                );
                break;
              default:
                break;
            }
            break;
          case 'database_knowledge_retriever':
            // console.log('==========================================');
            // console.log(`[${currentName}] ${event}`);
            // console.log(data);
            // console.log('==========================================');
            switch (event) {
              case 'on_tool_start':
                uiStream.update(
                  <BotSpinnerMessage>
                    Looking up system documents for information about{' '}
                    <strong>{JSON.parse(data.input.input).query}</strong> ...
                  </BotSpinnerMessage>,
                );
                break;
              case 'on_tool_end':
                usedTools.push({
                  id: (data.output as ToolMessage).tool_call_id,
                  name: currentName,
                  input: (data as any).input.input,
                  output: (data.output as ToolMessage).content as any,
                });
                uiStream.update(
                  <BotSpinnerMessage>AI thinking...</BotSpinnerMessage>,
                );
                break;
              default:
                break;
            }
            break;
          case 'ChatOpenAI':
            // console.log('==========================================');
            // console.log(`[${currentName}] ${event}`);
            // console.log(data);
            // console.log('==========================================');

            if (!!(data as AIMessage).tool_calls?.length) {
              // is calling tools, not responding to user
              // console.log('skip');
              break;
            }
            switch (event) {
              case 'on_chat_model_start':
                currentMessage = '';
                break;
              case 'on_chat_model_stream':
                currentMessage += data.chunk.content;
                uiStream.update(
                  <BotMessage
                    content={currentMessage!}
                    tools={usedTools}
                    runId={runId}
                  />,
                );
                break;
              case 'on_chat_model_end':
                const finalMessage = (data.output as AIMessageChunk)
                  .content as string;
                assistantMessageContent = finalMessage;
                currentMessage = undefined;
                break;
              default:
                break;
            }
            break;
          default:
            // console.log(`[agentStreamChunk] ${currentName} is skipped`);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    }

    uiStream.done();

    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: assistantMessageContent,
      tools: usedTools,
      runId: runId,
    };
    aiState.done({
      ...aiState.get(),
      messages: [...aiState.get().messages, assistantMessage],
    });
  })();

  return {
    id: assistantMessageId,
    role: 'assistant',
    display: uiStream.value,
    runId: runId,
  };
}

// // @deprecated for usage reference only
// export async function submitUserMessageToLLMWithTool(
//   message: string,
// ): Promise<ClientMessage> {
//   'use server';

//   const session = await auth();

//   if (!session?.user) {
//     throw 'Session not found';
//   }

//   const aiState = getMutableAIState<typeof AssistantAIProvider>();

//   const userMessage: Message = {
//     id: generateId(),
//     role: 'user',
//     content: message,
//   };

//   aiState.update({
//     ...aiState.get(),
//     messages: [...aiState.get().messages, userMessage],
//   });

//   const result = await streamUI({
//     model: openai('gpt-4o-mini'),
//     messages: [...aiState.get().messages, userMessage],
//     text: ({ content, done }) => {
//       if (done) {
//         const assistantMessage: ServerMessage = {
//           id: generateId(),
//           role: 'assistant',
//           content,
//         };

//         aiState.done({
//           ...aiState.get(),
//           messages: [...aiState.get().messages, userMessage, assistantMessage],
//         });
//       }
//       return <BotMessage content={content} />;
//     },
//     tools: {
//       showStockInformation: {
//         description:
//           'Get stock information for symbol for the last numOfMonths months',
//         parameters: z.object({
//           symbol: z
//             .string()
//             .describe('The stock symbol to get information for'),
//           numOfMonths: z
//             .number()
//             .describe('The number of months to get historical information for'),
//         }),
//         generate: async ({ symbol, numOfMonths }) => {
//           const toolMessage: ServerMessage = {
//             id: generateId(),
//             role: 'tool',
//             content: [
//               {
//                 type: 'tool-result',
//                 toolCallId: '',
//                 toolName: 'showStockInformation',
//                 result: { symbol, numOfMonths },
//               },
//             ],
//           };

//           aiState.done({
//             ...aiState.get(),
//             messages: [...aiState.get().messages, toolMessage],
//           });

//           return (
//             <BotMessage
//               className='font-mono'
//               content={`Stock information for ${symbol} for the last ${numOfMonths} months`}
//             />
//           );
//         },
//       },
//     },
//   });

//   return {
//     id: generateId(),
//     role: 'assistant',
//     display: result.value,
//   };
// }

export const AssistantAIProvider = createAI<
  AssistantAIState,
  AssistantUIState,
  AssistantActions
>({
  actions: {
    // submitUserMessageToLangchainRunanle: submitUserMessageToLangchainRunanle,
    submitUserMessageToLangchainAgent: submitUserMessageToLangchainAgent,
    // submitUserMessageToLLMWithTool: submitUserMessageToLLMWithTool,
  },
  // initialUIState: [],
  // initialAIState: { id: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server';

    const session = await auth();
    if (!session?.user) {
      return undefined;
    }

    const aiState = getAIState() as AssistantAIState;
    return getUIStateFromAIState(aiState);
  },
  onSetAIState: async ({ state, done }) => {
    'use server';

    const session = await auth();
    if (!session?.user) {
      return;
    }

    if (!done) {
      return;
    }

    const { id, messages } = state;

    setCurrentUserActiveChat(id).then();

    const createdAt = new Date();
    const userId = session.user.id as string;
    const path = `/chat/${id}`;
    const firstMessageContent = messages[0].content as string;
    const title = firstMessageContent.substring(0, 100);
    const chat: Chat = {
      id: id,
      title,
      userId,
      createdAt,
      messages,
      path,
    };
    await saveChat(userId, id, chat);
  },
});

const convertMessageToLangChainMessage = (
  message: Message,
): HumanMessage | AIMessage | ClientMessage => {
  if (message.role === 'user') {
    return new HumanMessage(message.content as string);
  } else if (message.role === 'assistant') {
    return new AIMessage(message.content as string);
  } else {
    return new ChatMessage(message.content as string, message.role);
  }
};

// Equivalent to Promise.withResolvers<T>(), not sure why it passed the linter but caused run time error.
function PromiseWithResolvers<T>() {
  let resolve: (value: T | PromiseLike<T>) => void = () => {};
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}
