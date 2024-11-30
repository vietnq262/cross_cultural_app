import { NextRequest, NextResponse } from 'next/server';

import {
  addDocument,
  deleteDocument,
  getDocuments,
} from '@/lib/supabase/db/document';
import { DocumentFileData } from '@/lib/types';
import { auth, Session, SessionUserData } from '@/auth';

export type ListDocumentResponse = { id: string; name: string }[];

// Get list of documents
export async function GET(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(session.user as SessionUserData).is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const documents = await getDocuments();
    const response = documents.map((document) => ({
      id: document.id,
      name: document.name,
    }));
    return NextResponse.json(response);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export type CreateDocumentRequest = DocumentFileData;

// create document
export async function POST(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(session.user as SessionUserData).is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = (await req.json()) as CreateDocumentRequest;
    await addDocument(body);
    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

// Delete a document
export async function DELETE(req: NextRequest) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(session.user as SessionUserData).is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const documentId = req.nextUrl.searchParams.get('document_id');

    if (!documentId) {
      return NextResponse.json(
        { error: 'You must provide a documentId.' },
        { status: 400 },
      );
    }
    await deleteDocument(documentId);
    return NextResponse.json({}, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
