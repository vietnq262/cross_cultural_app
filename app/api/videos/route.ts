import { NextRequest, NextResponse } from 'next/server';

import OpenAI from 'openai';

import { auth, Session } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CreateVideoRequest, VideoFileData } from '@/lib/types';

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get list of videos
export async function GET(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = createSupabaseServerClient();
    const { data: videos, error } = await client
      .from('videos')
      .select('*')
      .is('deleted_at', null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(videos);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

// create video
export async function POST(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as CreateVideoRequest;
  const supabase = createSupabaseServerClient();
  try {
    const audioFileUrl = supabase.storage
      .from('documents')
      .getPublicUrl(body.audio_file_path).data.publicUrl;

    const result = await openAIClient.audio.transcriptions.create({
      file: await fetch(audioFileUrl),
      model: 'whisper-1',
    });
    const transcribeText = result.text;

    const data: VideoFileData = {
      ...body,
      created_by: session.user.id,
      created_at: new Date().toISOString(),
      original_transcribe_text: transcribeText,
      transcribe_text: transcribeText,
    };

    await supabase.from('videos').insert(data);

    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    // clean up file in case of error
    await supabase.storage
      .from('documents')
      .remove([body.path, body.audio_file_path]);

    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
