# Overview

Main features:

- Admin can upload documents to be used as knowledge base for RAG.
- Simple Q&A RAG chatbot with uploaded documents + wikipedia as knowledge base.
- Video transcribe
- Writing AI assistant

# Tech stack

- NextJS 14 (latest as the time of development)
- Supabase (for database, storage)
- NextAuth v5 aka Auth.js with supabase adapter for auth, support username/password and google login.
- Langchain (for chatbot architecture) and Langsmith (for monitoring and feedback)
- OpenAI (for LLM)
- Vercel (for web-app deployment/hosting)

# Setup

## Development

### Prerequisites:

- NodeJS 20
- Third party services account & API keys:
  - Supabase
  - Docker (optional, for local Supabase server)
  - OpenAI
  - Google OAuth credentials
  - Langsmith (optional)
  - see [.env.example](.env.example) for more details.

### Steps:

1. Clone the repository
2. Install dependencies: `npm install`
3. Initialize local Supabase services (skip if using Supabase cloud):
   - `npx supabase init` and follow the instructions to create/select a project.
   - `npx supabase start` to start the local Supabase server using docker. Migration will be run automatically, API credentials will be generated and print to console after first run.
4. Prepare supabase config:

   - Expose `next_auth` schema to API. (detail in notes section)
   - Create `document` storage bucket & setup policy for uploading files from web. (detail in notes section)

5. Setup environment variables: clone [.env.example](.env.example) to `.env` and fill in the values.
6. Run the development server: `npm run dev`

## Deployment

The project is deployed on Vercel. Automatically deploy when push to `main` branch.

## Notes

### Sync database schema types to codebase from current database

`npx supabase gen types --lang=typescript --project-id=<project-id> --schema=public,next_auth  > ./lib/supabase/database.types.ts`

### Expose custom db schema `next_auth` to access via supabase client API

Access Supabase project dashboard > settings > API > Data API settings > Expose schema > add `next_auth` beside `public`

### Setup supabase storage policy for uploading document files from web

1. Access Supabase project dashboard > Storage

2. Make sure `documents` bucket is created

3. Storage policies > New policy:
   - Policy name: anything
   - Target roles: anon, authenticated
   - WITH CHECK expression: `(bucket_id = 'documents'::text)`

# Main features

## System document upload/processing for RAG

To overcome the limitation of Vercel serverless function execution time (maximum 60s for free plan), we process document upload/processing from client side and send API request to server to save document records in db.

**Brief flow:**

1. User select document file to upload & submit form
2. Client:
   - Split file into text chunks
   - Upload original file supabase storage
   - Send API request to server
3. Server:
   - Save document record to database
   - For each document chunk: Use LangChain supabase vector store to generate OpenAI embeddings and save it + chunk content & metadata to database

**Detail implementations:**

- Client side: `lib/document-loaders/index.ts` `uploadAndProcessDocument` function.
- Server side: `app/api/documents/route.ts` `POST` handler.

## Chatbot

We use Vercel AI SDK (v4 was the latest as the time of development) + Langchain ReAct agent for chatbot with tools calling architecture.

**Brief flow:**

1. User submit message

2. Using Langchain `createReactAgent` to create agent with tools calling with 2 tools:
    - Wikipedia tool: search wikipedia for information
    - Database knowledge retriever tool: search knowledge base from uploaded documents

3. Since existing Vercel AI SDK langchain adapter did not expose tools callings metadata for displaying progress in the UI, we manually extract metadata from langchain event stream to filter and display progress in the UI.

**Detail implementations:**

- Messages & chat state handling: See `lib/chat/assistant-ai-actions.tsx` `submitUserMessageToLangchainAgent` function.

### LLM Tracing & Feedback

We use Langsmith API for LLM tracing & feedback collection.

## Video processing

To overcome the limitation of Vercel serverless function execution time (maximum 60s for free plan), Supabase storage file limit (maximum 50MB in free plan) and OpenAI audio transcription limit (maximum 25MB file size), we process video transcribe from client side and send API request to server to save video records in db.

**Brief flow:**

1. User select video file to upload & submit form
2. Client:
   - Using ffmpeg in wasm to extract audio to a file from video, also compress audio quality to reduce file size (to make it under 25MB limit of OpenAI audio transcription API and faster processing for not exceed Vercel serverless function execution time limit 60s) (this will produce about 1/10 of original video file size).
   - Upload video and  audio file to supabase storage
   - Send API request to server
3. Server:
   - Download audio file from supabase storage
   - Send audio file to OpenAI API for transcription
   - Wait for transcription result
   - Save video infomation + transcription result to database
   - Notes: All these server steps need to be done in 60s limit of Vercel serverless function

**Detail implementations:**

- Client side: `components/media-preprocess-form.tsx` `MediaPreprocessForm` component.
- Server side: `app/api/videos/route.ts` `POST` handler.

## Writing assistant

Just simple LLM text completions.

Use vercel AI SDK to create a streamable text completion function which

- based on user action type (essay-introduction, essay-body, essay-conclusion, essay-overall) to select the corresponding prompt template
- use prompt template + video data,current writing data to generate the prompt
- stream the text completion result to client

**Detail implementations:**

- Server side: `app/api/assistants/writing/route.ts` `POST` handler.
