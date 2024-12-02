import * as Sentry from '@sentry/nextjs';
import { registerOTel } from '@vercel/otel';
import { AISDKExporter } from 'langsmith/vercel';

import { langsmithClient } from './lib/langsmith';

export async function register() {
  registerOTel({
    serviceName: process.env.LANGCHAIN_PROJECT,
    traceExporter: new AISDKExporter({ client: langsmithClient }),
  });

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
