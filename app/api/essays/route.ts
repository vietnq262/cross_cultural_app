import { NextRequest, NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import { auth, Session } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  CreateEssayRequest,
  CreateEssayResponse,
  LIST_ESSAY_DEFAULT_PAGE_SIZE,
  ListEssayResponse,
} from '@/lib/types';

export async function GET(req: NextRequest) {
  const session = (await auth()) as Session | null;
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const pageIndex = parseInt(searchParams.get('pageIndex') || '0');
    const pageSize = parseInt(
      searchParams.get('pageSize') || LIST_ESSAY_DEFAULT_PAGE_SIZE.toString(),
    );

    // Search filters
    const search = searchParams.get('search') || '';
    const videoId = searchParams.get('videoId') || '';
    const videoTag = searchParams.get('videoTag') || '';
    const authorId = searchParams.get('authorId') || '';

    // Apply filters conditionally
    let query = client
      .from('essays')
      .select(
        `
        id,
        video_id,
        created_at,
        created_by,
        updated_at,
        deleted_at,
        title,
        introduction,
        body,
        conclusion,
        videos!inner (
          id, 
          name, 
          tags
        )
      `,
        {
          count: 'exact',
        },
      )
      .is('deleted_at', null)
      .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);

    // Apply search filters
    if (search) {
      query = query.or(`title.ilike.%${search}%`);
    }
    if (videoId) {
      query = query.eq('video_id', videoId);
    }
    if (videoTag) {
      query = query.contains('videos.tags', [videoTag]);
    }
    if (authorId) {
      query = query.eq('created_by', authorId);
    }

    const { data: essays, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: ListEssayResponse = {
      items: essays.map((data) => ({
        id: data.id,
        videoId: data.video_id,
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        deletedAt: data.deleted_at || undefined,
        title: data.title,
        introduction: data.introduction,
        body: data.body,
        conclusion: data.conclusion,
        video: data.videos as any,
      })),
      total: count || 0,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

// create Essay
export async function POST(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as CreateEssayRequest;

  const supabase = createSupabaseServerClient();

  try {
    // check if video is exist
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', body.videoId)
      .single();
    if (videoError || !video) {
      return NextResponse.json(
        { error: '[Bad Request] Video not found' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('essays')
      .insert({
        id: uuidv4(),
        video_id: body.videoId,
        created_by: session.user.id,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),

        title: body.title,
        introduction: body.introduction,
        body: body.body,
        conclusion: body.conclusion,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: CreateEssayResponse = {
      id: data.id,
      videoId: data.video_id,

      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at || undefined,

      title: data.title,
      introduction: data.introduction,
      body: data.body,
      conclusion: data.conclusion,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
