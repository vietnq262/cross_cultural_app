import { registerOTel } from '@vercel/otel';
import { AISDKExporter } from 'langsmith/vercel';
import { langsmithClient } from './lib/langsmith';

export async function register() {
  registerOTel({
    serviceName: process.env.LANGCHAIN_PROJECT,
    traceExporter: new AISDKExporter({ client: langsmithClient }),
  });
}
