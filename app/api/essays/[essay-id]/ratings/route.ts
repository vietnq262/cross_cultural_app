import { NextRequest, NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import { auth, Session } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type APIRouteParams = {
  'essay-id': string;
};

export type GetEssayRatingsResponse = {
  avgScore: number;
  numberOfRate: number;
  ratedScore?: number;
};

export type RateEssayRequest = {
  score: number;
};

export async function GET(
  req: NextRequest,
  { params }: { params: APIRouteParams },
) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const essayId = params['essay-id'];

  const supabase = createSupabaseServerClient();

  try {
    const { data: ratings, error } = await supabase
      .from('ratings')
      .select('id, score, created_by')
      .eq('essay_id', essayId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let response: GetEssayRatingsResponse = {
      avgScore: 0,
      numberOfRate: ratings?.length || 0,
      ratedScore: undefined,
    };

    if (!ratings || !ratings.length) {
      return NextResponse.json(response, { status: 200 });
    }

    for (const rating of ratings) {
      response.avgScore = response.avgScore + rating.score / ratings.length;
      if (rating.created_by === session.user?.id) {
        response.ratedScore = rating.score;
      }
    }

    return NextResponse.json(response, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: APIRouteParams },
) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const essayId = params['essay-id'];
  const { score } = (await req.json()) as RateEssayRequest;

  const supabase = createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert({
        id: uuidv4(),
        essay_id: essayId,
        created_by: session.user.id,
        created_at: new Date().toISOString(),
        score,
      })
      .select()
      .single();

    if (error) {
      // Check if the error is a unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '[Bad Request] User has already rated this essay' },
          { status: 400 },
        );
      }

      // Handle other errors
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
