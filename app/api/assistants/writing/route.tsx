import { NextRequest, NextResponse } from 'next/server';

import { streamText } from 'ai';
import { AISDKExporter } from 'langsmith/vercel';

import { auth, Session } from '@/auth';
import { actionLLM } from '@/lib/llm';
import {
  EvaluateEssayOverallPromptInput,
  evaluateEssayOverallPromptTemplate,
  EvaluateEssaySectionPromptInput,
  evaluateEssaySectionPromptTemplate,
  pullPrompt,
} from '@/lib/prompts';

type AssistType =
  | 'essay-introduction'
  | 'essay-body'
  | 'essay-conclusion'
  | 'essay-overall';

type WritingAssistRequestBody = {
  type: AssistType;
  videoData: {
    id: string;
    name: string;
    description: string;
    transcription: string;
  };
  writingData: {
    title: string;
    introduction: string;
    body: string;
    conclusion: string;
  };
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
    const requestData = (await req.json()) as WritingAssistRequestBody;

    const prompt = await preparePrompt(requestData);

    const metadata: Record<string, string> = {
      video_id: requestData.videoData.id,
      type: requestData.type,
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
        runName: 'writing-assistant',
        metadata: metadata,
      }),
    });

    return result.toDataStreamResponse();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function preparePrompt(
  requestData: WritingAssistRequestBody,
): Promise<string> {
  if (requestData.type === 'essay-overall') {
    const promptTemplate = await pullPrompt<EvaluateEssayOverallPromptInput>(
      'evaluate_essay_overall_prompt_template',
      evaluateEssayOverallPromptTemplate,
    );
    const prompt = await promptTemplate.format({
      video_name: requestData.videoData.name,
      video_description: requestData.videoData.name,
      video_transcription: requestData.videoData.name,
      writing_title: requestData.writingData.title,
      writing_introduction:
        requestData.writingData.introduction || 'no input yet',
      writing_body: requestData.writingData.body || 'no input yet',
      writing_conclusion: requestData.writingData.conclusion || 'no input yet',
    });
    return prompt;
  }

  if (
    ['essay-introduction', 'essay-body', 'essay-conclusion'].includes(
      requestData.type,
    )
  ) {
    const promptTemplate = await pullPrompt<EvaluateEssaySectionPromptInput>(
      'evaluate_essay_section_prompt_template',
      evaluateEssaySectionPromptTemplate,
    );
    let section;
    switch (requestData.type) {
      case 'essay-introduction':
        section = 'introduction';
        break;
      case 'essay-body':
        section = 'body';
        break;
      case 'essay-conclusion':
        section = 'conclusion';
        break;
    }
    const prompt = await promptTemplate.format({
      video_name: requestData.videoData.name,
      video_description: requestData.videoData.name,
      video_transcription: requestData.videoData.name,
      writing_title: requestData.writingData.title,
      writing_introduction:
        requestData.writingData.introduction || 'no input yet',
      writing_body: requestData.writingData.body || 'no input yet',
      writing_conclusion: requestData.writingData.conclusion || 'no input yet',
      section: section,
    });
    return prompt;
  }

  throw new Error('Invalid type');
}
