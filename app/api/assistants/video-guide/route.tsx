import { NextRequest, NextResponse } from 'next/server';

import { streamText } from 'ai';
import { AISDKExporter } from 'langsmith/vercel';

import { auth, Session } from '@/auth';
import { actionLLM } from '@/lib/llm';
import {
  guideVideoPresentationPromptTemplate,
  pullPrompt,
} from '@/lib/prompts';
import { GuideVideoPresentationPromptInput } from '@/lib/prompts';

// Default request body when using  VercelAI SDK useCompletion
type RequestData = {
  prompt: string;
};

/**
 * This handler used to upload document chunks with metadata to db
 * @param {NextRequest} req
 * @returns {Promise<NextResponse>}
 **/
export async function POST(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { prompt: topic }: RequestData = await req.json();

    const promptTemplate = await pullPrompt<GuideVideoPresentationPromptInput>(
      'guide_video_prompt_template',
      guideVideoPresentationPromptTemplate,
    );

    const prompt = await promptTemplate.format({
      topic: topic,
    });

    const metadata: Record<string, string> = {
      topic: topic,
      user_id: session.user.id,
    };
    if (session.user.username) {
      metadata.username = session.user.username;
    }
    if (session.user.email) {
      metadata.user_email = session.user.email;
    }

    const result = await streamText({
      model: actionLLM,
      prompt: prompt,
      experimental_telemetry: AISDKExporter.getSettings({
        runName: 'video-guide-assistant',
        metadata: metadata,
      }),
    });

    return result.toDataStreamResponse();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
