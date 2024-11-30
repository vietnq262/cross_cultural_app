import { ReactNode } from 'react';

import { BotMessage, UserMessage } from '@/components/chat-messages';
import {
  AssistantAIState,
  AssistantUIState,
} from '@/lib/chat/assistant-ai-actions';
import { Message } from '@/lib/types';

export const getUIStateFromAIState = (
  aiState: AssistantAIState,
): AssistantUIState => ({
  ...aiState,
  messages: aiState.messages
    // .filter((message) => message.role !== 'system')
    .map((message) => ({
      ...message,
      display: getMessageDisplay(message),
    })),
});

export const getMessageDisplay = (message: Message): ReactNode => {
  return message.role === 'system' ? (
    <></>
  ) : message.role === 'tool' ? (
    <div>
      <p>tool: s{message.content as any}</p>
    </div>
  ) : message.role === 'user' ? (
    <UserMessage content={message.content as any} />
  ) : message.role === 'assistant' ? (
    <BotMessage
      content={message.content as any}
      runId={message.runId}
      feedbackId={message.feedbackId}
      sources={message.sources}
      tools={message.tools}
    />
  ) : null;
};
