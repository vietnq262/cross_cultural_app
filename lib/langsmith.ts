import { Client } from 'langsmith';

export const langsmithClient = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY,
  apiUrl: process.env.LANGCHAIN_ENDPOINT,
});