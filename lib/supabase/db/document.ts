import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';

import { removeFileFromSupabaseStorage } from '@/lib/supabase/storage';
import { DocumentChunkMetadata, DocumentFileData } from '@/lib/types';

import { createSupabaseServerClient } from '../server';

const embeddings = new OpenAIEmbeddings();

function getSupabaseDocumentVectorStore() {
  const supabaseClient = createSupabaseServerClient();
  return new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: 'document_chunks',
    queryName: 'match_document_chunks',
  });
}

async function addDocumentChunks(
  documentChunks: { pageContent: string; metadata: DocumentChunkMetadata }[],
): Promise<string[]> {
  const store = getSupabaseDocumentVectorStore();
  return store.addDocuments(documentChunks);
}

async function getDocumentChunkIdsByDocumentId(
  doucmentId: string,
): Promise<string[]> {
  const supabaseClient = createSupabaseServerClient();
  const { data, error } = await supabaseClient
    .from('document_chunks')
    .select('id')
    .eq('metadata->>documentId', doucmentId);

  if (error) {
    throw new Error(`Failed to find documents: ${error.message}`);
  }

  return (data || []).map((d) => d.id as any);
}

async function deleteDocumentChunksByDocumentId(fileId: string): Promise<void> {
  const store = getSupabaseDocumentVectorStore();
  const documentIds = await getDocumentChunkIdsByDocumentId(fileId);
  if (documentIds.length) {
    await store.delete({ ids: documentIds });
  }
  return;
}

async function getDocuments() {
  const supabaseClient = createSupabaseServerClient();
  const { data, error } = await supabaseClient.from('documents').select('*');

  if (error) {
    throw new Error(`Failed to retrieve documents: ${error.message}`);
  }

  return data;
}

async function addDocument(fileData: DocumentFileData): Promise<void> {
  const supabaseClient = createSupabaseServerClient();

  // save document to documents
  const { data: savedDocument, error: saveDocumentError } = await supabaseClient
    .from('documents')
    .insert(fileData);

  if (saveDocumentError) {
    throw new Error(`Failed to insert document: ${saveDocumentError.message}`);
  }

  return;
}

// Main function to remove document
async function deleteDocument(documentId: string): Promise<void> {
  const supabaseClient = createSupabaseServerClient();
  const { data: documents, error } = await supabaseClient
    .from('documents')
    .select('id, path')
    .eq('id', documentId)
    .limit(1);

  if (error) {
    throw new Error(`Failed to insert document: ${error.message}`);
  }

  if (!documents.length) {
    return;
  }

  await removeFileFromSupabaseStorage(documents[0].path!);
  await supabaseClient.from('documents').delete().eq('id', documentId);

  await deleteDocumentChunksByDocumentId(documentId);
}

export {
  getSupabaseDocumentVectorStore,
  addDocument,
  getDocuments,
  deleteDocument,
  addDocumentChunks,
};
