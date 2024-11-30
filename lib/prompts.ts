import { InputValues } from '@langchain/core/dist/utils/types';
import { PromptTemplate } from '@langchain/core/prompts';
import * as hub from 'langchain/hub';

export async function pullPrompt<
  RunInput extends InputValues = any,
  RunOutput extends string = any,
>(
  template: string,
  fallback: PromptTemplate<RunInput, RunOutput>,
  forceFallback = process.env.USE_IN_CODE_PROMPTS === 'true',
): Promise<PromptTemplate<RunInput, RunOutput>> {
  if (forceFallback) {
    return Promise.resolve(fallback);
  }
  try {
    return await hub.pull<PromptTemplate<RunInput, RunOutput>>(template);
  } catch (e) {
    return Promise.resolve(fallback);
  }
}


export type GuideVideoPresentationPromptInput = {
  topic: string;
}

export type EvaluateEssaySectionPromptInput = {
  video_name: string;
  video_description: string;
  video_transcription: string;
  writing_title: string;
  writing_introduction: string;
  writing_body: string;
  writing_conclusion: string;
  section: string;
}


export type EvaluateEssayOverallPromptInput = {
  video_name: string;
  video_description: string;
  video_transcription: string;
  writing_title: string;
  writing_introduction: string;
  writing_body: string;
  writing_conclusion: string;
}

export const guideVideoPresentationPromptTemplate = PromptTemplate.fromTemplate<GuideVideoPresentationPromptInput>(`
You are an AI assisant aim to guide student to record a representation video about a culture topic, for example: Traditional Japanese tea ceremony...
Keep the guide short.

Here's the topic: {topic}
`);


export const evaluateEssaySectionPromptTemplate = PromptTemplate.fromTemplate<EvaluateEssaySectionPromptInput>(`
Evaluate the following section of the writing in relation to the cultural topic described in the video. Consider how well it reflects the key points, themes, or cultural elements discussed. Analyze the coherence, relevance, and accuracy of the section. Provide feedback on how effectively this section addresses the cultural topic and if there are any areas where additional depth or clarification is needed. Keep your feedback short and concise.

Video Information:

- Name: {video_name}

- Description: {video_description}

- Transcription: {video_transcription}

Writing:

- Title: {writing_title}

- Introduction: {writing_introduction}

- Body: {writing_body}

- Conclusion: {writing_conclusion}

Section to evalutate: {section}

`);


export const evaluateEssayOverallPromptTemplate = PromptTemplate.fromTemplate<EvaluateEssayOverallPromptInput>(`

Evaluate the following writing in relation to the cultural topic described in the video. Consider how well the writing reflects the key points, themes, or cultural elements discussed. Analyze the coherence, relevance, and accuracy of the introduction, body, and conclusion. Provide feedback on how effectively the writing addresses the cultural topic and if there are any areas where additional depth or clarification is needed. Keep your feedback short and concise.

Video Information:

- Name: {video_name}

- Description: {video_description}

- Transcription: {video_transcription}

Writing:

- Title: {writing_title}

- Introduction: {writing_introduction}

- Body: {writing_body}

- Conclusion: {writing_conclusion}

`);

export const systemAssistantChatBotPromptTemplate = PromptTemplate.fromTemplate(`
You are a helpful chatbot assistant.

If you don't know how to answer a question, use the available tools to look up relevant information.

Keep answer short in 1-2 sentences.

`);
