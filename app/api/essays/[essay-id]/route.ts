import { NextRequest, NextResponse } from 'next/server';

import { auth, Session } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Essay } from '@/lib/types';

type APIRouteParams = {
  'essay-id': string;
};

export type GetEssayDetailResponse = Essay;

export type UpdateEssayRequest = Pick<
  Essay,
  'title' | 'introduction' | 'body' | 'conclusion'
>;

// Get essay detail
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
      .from('essays')
      .select('*')
      .eq('id', essayId)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    const response: Essay = {
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
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Update a essay
export async function POST(
  req: NextRequest,
  { params }: { params: APIRouteParams },
) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const essayId = params['essay-id'];

  const body = (await req.json()) as UpdateEssayRequest;

  try {
    const client = createSupabaseServerClient();

    // get current essay
    const { data: essay, error } = await client
      .from('essays')
      .select('*')
      .eq('id', essayId)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!essay) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    const isOwner = essay.created_by === session.user.id;
    const isAdmin = session.user.is_admin;
    const canUpdate = isOwner || isAdmin;
    if (!canUpdate) {
      return NextResponse.json(
        { error: 'You are not allowed to update this essay' },
        { status: 403 },
      );
    }

    // save current essay to history
    await client.from('essay_history').insert({
      essay_id: essay.id,
      created_at: essay.updated_at || essay.created_at,
      title: essay.title,
      introduction: essay.introduction,
      body: essay.body,
      conclusion: essay.conclusion,
    });

    // update current essay
    await client
      .from('essays')
      .update({
        updated_at: new Date().toISOString(),
        title: body.title,
        introduction: body.introduction,
        body: body.body,
        conclusion: body.conclusion,
      })
      .eq('id', essayId)
      .is('deleted_at', null);

    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

// Delete a essay
export async function DELETE(
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

    // get current essay
    const { data: essay, error } = await client
      .from('essays')
      .select('*')
      .eq('id', essayId)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!essay) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    const isOwner = essay.created_by === session.user.id;
    const isAdmin = session.user.is_admin;
    const canDelete = isOwner || isAdmin;
    if (!canDelete) {
      return NextResponse.json(
        { error: 'You are not allowed to delete this essay' },
        { status: 403 },
      );
    }

    await client
      .from('essays')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', essayId)
      .is('deleted_at', null);

    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
