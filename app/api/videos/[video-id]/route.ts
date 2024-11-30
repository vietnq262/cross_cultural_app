import { NextRequest, NextResponse } from 'next/server';

import { auth, Session, SessionUserData } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { GetVideoDetailResponse, UpdateVideoRequest } from '@/lib/types';

// Get video detail
export async function GET(
  req: NextRequest,
  { params }: { params: { 'video-id': string } },
) {
  const videoId = params['video-id'];

  if (!videoId) {
    return NextResponse.json(
      { error: 'You must provide a videoId.' },
      { status: 404 },
    );
  }

  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = createSupabaseServerClient();

    const { data, error } = await client
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data! as GetVideoDetailResponse, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Update a video
export async function POST(
  req: NextRequest,
  { params }: { params: { 'video-id': string } },
) {
  const videoId = params['video-id'];

  if (!videoId) {
    return NextResponse.json(
      { error: 'You must provide a videoId.' },
      { status: 404 },
    );
  }

  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as UpdateVideoRequest;

  try {
    const client = createSupabaseServerClient();

    // get current video
    const { data: video, error } = await client
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const isOwner = video.created_by === session.user.id;
    const isAdmin = session.user.is_admin;
    const canUpdate = isOwner || isAdmin;
    if (!canUpdate) {
      return NextResponse.json(
        { error: 'You are not allowed to update this video' },
        { status: 403 },
      );
    }

    await client
      .from('videos')
      .update({
        name: body.name,
        description: body.description,
        tags: body.tags,
        transcribe_text: body.transcribe_text,
      })
      .eq('id', videoId);

    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

// Delete a video
export async function DELETE(
  req: NextRequest,
  { params }: { params: { 'video-id': string } },
) {
  const videoId = params['video-id'];

  if (!videoId) {
    return NextResponse.json(
      { error: 'You must provide a videoId.' },
      { status: 404 },
    );
  }

  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = createSupabaseServerClient();

    // get current video
    const { data: video, error } = await client
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const isOwner = video.created_by === session.user.id;
    const isAdmin = session.user.is_admin;
    const canDelete = isOwner || isAdmin;
    if (!canDelete) {
      return NextResponse.json(
        { error: 'You are not allowed to delete this video' },
        { status: 403 },
      );
    }

    await client
      .from('videos')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', videoId);

    await client.storage
      .from('documents')
      .remove([video.path!, video.audio_file_path!]);

    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
