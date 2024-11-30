export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'development' | 'production';

      SUPABASE_URL: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

      OPENAI_API_KEY: string;

      AUTH_SECRET: string;

      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRE: string;

      LANGCHAIN_TRACING_V2: string;
      LANGCHAIN_ENDPOINT: string;
      LANGCHAIN_API_KEY: string;
      LANGCHAIN_PROJECT: string;
      LANGCHAIN_CALLBACKS_BACKGROUND?: string;

      LLM_MODEL_CHAT: string;
      LLM_MODEL_ACTION: string;
      NEXT_PUBLIC_APP_MAX_VIDEO_SIZE?: string;
    }
  }
}
