import { NextRequest, NextResponse } from 'next/server';

import { addDocumentChunks } from '@/lib/supabase/db/document';
import { DocumentChunkMetadata } from '@/lib/types';
import { auth, Session, SessionUserData } from '@/auth';

export type UploadDocumentChunksRequest = {
  chunks: {
    pageContent: string;
    metadata: DocumentChunkMetadata;
  }[];
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

  if (!(session.user as SessionUserData).is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = (await req.json()) as UploadDocumentChunksRequest;

    await addDocumentChunks(body.chunks);

    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
