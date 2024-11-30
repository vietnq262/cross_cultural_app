import { NextRequest, NextResponse } from 'next/server';

import { Client } from 'langsmith';
import { auth, Session } from '@/auth';

const langsmithClient = new Client();

/**
 * This handler retrieves a LangSmith trace URL for the given run.
 * @param {NextRequest} req
 * @returns {Promise<NextResponse>}
 **/
export async function GET(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const runId = req.nextUrl.searchParams.get('run_id');
    if (!runId) {
      return NextResponse.json(
        { error: 'You must provide a run id.' },
        { status: 400 },
      );
    }
    const traceUrl = await langsmithClient.shareRun(runId);
    return NextResponse.json({ url: traceUrl }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
