import { NextRequest, NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import { auth, Session } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type APIRouteParams = {
  'essay-id': string;
};

export type EssayHistoryVersion = {
  id: string;
  essayId: string;
  createdAt: string;
  title: string;
  introduction: string;
  body: string;
  conclusion: string;
};

export type GetEssayHistoriesResponse = {
  histories: EssayHistoryVersion[];
};

// GET all histories of an essay
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
      .from('essay_history')
      .select('*')
      .eq('essay_id', essayId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let histories: EssayHistoryVersion[] = [];

    if (!data) {
      return NextResponse.json(
        { histories: histories } as GetEssayHistoriesResponse,
        { status: 404 },
      );
    }

    histories = data.map((record) => ({
      id: record.id.toString(),
      essayId: record.essay_id,
      createdAt: record.created_at,
      title: record.title,
      introduction: record.introduction,
      body: record.body,
      conclusion: record.conclusion,
    }));

    return NextResponse.json(
      { histories: histories } as GetEssayHistoriesResponse,
      { status: 200 },
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
