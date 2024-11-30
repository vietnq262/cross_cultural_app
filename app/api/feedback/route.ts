import { NextRequest, NextResponse } from 'next/server';

import { Client } from 'langsmith';
import { auth, Session } from '@/auth';

const langsmithClient = new Client();

export async function GET(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const feedbackId = req.nextUrl.searchParams.get('feedback_id');
    if (!feedbackId) {
      return NextResponse.json(
        { error: 'You must provide a feedback id.' },
        { status: 400 },
      );
    }

    const feedback = await langsmithClient.readFeedback(feedbackId);
    return NextResponse.json({ feedback }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * This handler creates feedback for a LangSmith trace.
 */
export async function POST(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const runId = body.run_id;

    const score = body.score;
    if (!runId || isNaN(score)) {
      return NextResponse.json(
        { error: 'You must provide a run id and a score.' },
        { status: 400 },
      );
    }
    const comment = body.comment;

    const feedback = await langsmithClient.createFeedback(runId, 'user_score', {
      score,
      comment,
    });
    return NextResponse.json({ feedback }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * This handler updates feedback for a LangSmith trace.
 */
export async function PUT(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const feedbackId = body.id;
    const score = body.score;
    if (!feedbackId) {
      return NextResponse.json(
        { error: 'You must provide a feedback id' },
        { status: 400 },
      );
    }

    const comment = body.comment;

    await langsmithClient.updateFeedback(feedbackId, {
      score,
      comment,
    });
    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
