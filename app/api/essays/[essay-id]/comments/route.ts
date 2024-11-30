import { NextRequest, NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import { auth, Session } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type APIRouteParams = {
  'essay-id': string;
};

type EssayComment = {
  id: string;
  createdAt: string;
  createdBy: string;
  content: string;
};

export type GetEssayCommentsResponse = {
  comments: EssayComment[];
};

export type CommentEssayRequest = {
  content: string;
};

// GET all comments of an essay
export async function GET(
  req: NextRequest,
  { params }: { params: APIRouteParams },
) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const essayId = params['essay-id'];

  try {
    const client = createSupabaseServerClient();
    const { data, error } = await client
      .from('comments')
      .select('*')
      .eq('essay_id', essayId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let comments: EssayComment[] = [];

    if (!data) {
      return NextResponse.json(
        { comments: comments } as GetEssayCommentsResponse,
        { status: 404 },
      );
    }

    comments = data.map((record) => ({
      id: record.id,
      createdAt: record.created_at,
      createdBy: record.created_by,
      content: record.content,
    }));

    return NextResponse.json(
      { comments: comments } as GetEssayCommentsResponse,
      { status: 200 },
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST new comment
export async function POST(
  req: NextRequest,
  { params }: { params: APIRouteParams },
) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const essayId = params['essay-id'];

  const body = (await req.json()) as CommentEssayRequest;

  try {
    const client = createSupabaseServerClient();

    await client.from('comments').insert({
      id: uuidv4(),
      essay_id: essayId,
      created_by: session.user.id,
      created_at: new Date().toISOString(),
      content: body.content,
    });

    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
