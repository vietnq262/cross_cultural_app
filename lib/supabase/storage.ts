import 'server-only';

import { createSupabaseServerClient } from './server';

async function uploadFileToSupabaseStorage(
  file: File,
): Promise<{ id: string; path: string; fullPath: string }> {
  const supabaseClient = createSupabaseServerClient();
  const { error, data } = await supabaseClient.storage
    .from('documents')
    .upload(file.name, file);

  if (error) {
    throw new Error(`Failed to upload document: ${error.message}`);
  }

  return data;
}

async function removeFileFromSupabaseStorage(filePath: string): Promise<void> {
  const supabaseClient = createSupabaseServerClient();
  const { error } = await supabaseClient.storage
    .from('documents')
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to remove document: ${error.message}`);
  }
}

export { uploadFileToSupabaseStorage, removeFileFromSupabaseStorage };
