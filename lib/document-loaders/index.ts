import { UploadDocumentChunksRequest } from '@/app/api/documents/chunks/route';
import { DocumentChunkMetadata, DocumentFileData } from '@/lib/types';

import { supabaseClient } from '../supabase/client';
import { splitDocxToChunks } from './docx';
import { splitPdfToChunks } from './pdf';

const uploadDocument = async (file: File, documentName: string) => {
  const { data: uploadedFileMetadata, error: uploadError } =
    await supabaseClient.storage.from('documents').upload(documentName, file);

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }

  const documentId = uploadedFileMetadata!.id;

  try {
    // call api to create document record in db
    await fetch(`/api/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: documentId,
        name: documentName,
        path: uploadedFileMetadata.path,
        full_path: uploadedFileMetadata.fullPath,
        file_type: file.type,
        file_size: file.size,
        file_last_modified: new Date().getTime(),
      } as DocumentFileData),
    });

    return documentId;
  } catch (e) {
    // in case of error, delete the uploaded file
    await supabaseClient.storage
      .from('documents')
      .remove([uploadedFileMetadata.path]);

    // and re-throw the error
    throw e;
  }
};

const uploadDocumentChunks = async (request: UploadDocumentChunksRequest) => {
  await fetch(`/api/documents/chunks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return;
};

const deleteDocument = async (documentId: string) => {
  const response = await fetch(`/api/documents?document_id=${documentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Operation was not completed');
  }
};

const splitDocumentToChunks = async (file: File) => {
  let chunks: { content: string; loc: DocumentChunkMetadata['loc'] }[] = [];
  switch (file.type) {
    case 'application/pdf':
      chunks = await splitPdfToChunks(file);
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      chunks = await splitDocxToChunks(file);
      break;
    default:
      throw new Error('Unsupported file type');
  }

  return chunks;
};

// process pdf file, upload to supabase storage, split into chunks and upload to db
async function* uploadAndProcessDocument(file: File): AsyncGenerator<
  string,
  {
    documentId: string;
    documentName: string;
  },
  undefined
> {
  const documentName = file.name;

  yield `[Document ${documentName}]: Processing file...`;
  // try to split the file into chunks before upload
  const chunks = await splitDocumentToChunks(file);

  yield `[Document ${documentName}]: Uploading file...`;
  const documentId = await uploadDocument(file, documentName);

  const chunkSize = 100; // 100 chunks per request, safe limit for server to handle embedding vectors within vercel time limit

  let uploadChunkError;

  for (
    let chunkStartIndex = 0;
    chunkStartIndex < chunks.length;
    chunkStartIndex += chunkSize
  ) {
    const chunkEndIndex =
      chunkStartIndex + chunkSize > chunks.length
        ? chunks.length
        : chunkStartIndex + chunkSize;
    const chunkSlice = chunks.slice(chunkStartIndex, chunkEndIndex);

    yield `[Document ${documentName}]: Uploading chunks... (${chunkStartIndex + 1} - ${chunkEndIndex + 1} of ${
      chunks.length + 1
    })`;

    try {
      const chunksToUpload: UploadDocumentChunksRequest['chunks'] =
        chunkSlice.map((chunk) => ({
          pageContent: chunk.content,
          metadata: {
            loc: chunk.loc,
            source: documentName,
            documentId: documentId,
          },
        }));
      await uploadDocumentChunks({ chunks: chunksToUpload });
    } catch (e) {
      uploadChunkError = e;
      break;
    }
  }

  if (uploadChunkError) {
    await fetch(`/api/documents`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    throw uploadChunkError;
  }

  yield `[Document ${documentName}]: Done!`;

  return {
    documentId,
    documentName,
  };
}

export { setupPdfjsWorker } from './pdf';

// A generator function that yield progress messages
export async function* submitUpdateDocuments(data: {
  added: File[];
  removed: string[];
}): AsyncGenerator<string, void, undefined> {
  for (const addedFile of data.added) {
    const uploadProcess = uploadAndProcessDocument(addedFile);

    // loop through the generator to get progress messages and re-yield them
    for await (const progressMessage of uploadProcess) {
      yield progressMessage;
    }
  }

  for (const removedDocumentId of data.removed) {
    yield `Deleting document ${removedDocumentId}...`;
    await deleteDocument(removedDocumentId);
  }

  yield 'All done!';

  return;
}
