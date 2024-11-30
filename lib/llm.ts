import { openai } from '@ai-sdk/openai';

export const actionLLM = openai(process.env.LLM_MODEL_ACTION);
