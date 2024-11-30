'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { ListDocumentResponse } from '@/app/api/documents/route';
import { SpinnerIcon } from '@/components/ui/icons';

import ManageDocumentForm from './manage-document-form';
import { Button } from './ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function useListDocuments() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ id: string; name: string }[]>(
    [],
  );

  const reloadList = async () => {
    setLoadError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/documents');
      const documents = (await response.json()) as ListDocumentResponse;
      setDocuments(
        documents.map((doc) => ({
          id: doc.id,
          name: doc.name,
        })),
      );
    } catch (error) {
      setLoadError(error as any);
      setDocuments([]);
    }

    setLoading(false);
  };

  return {
    isLoading,
    loadError,
    documents,
    reloadList,
  };
}

const DocumentSetting = () => {
  const [isUpdating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { documents, reloadList, loadError, isLoading } = useListDocuments();

  useEffect(() => {
    reloadList();
  }, []);

  return (
    <div className='min-h-0 flex-1'>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      ) : loadError ? (
        <div className="flex size-full flex-col items-center justify-center">
          <p className="text-destructive">{loadError}</p>
          <Button
            variant="outline"
            size="sm"
            className="mx-auto mt-2"
            onClick={reloadList}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <ManageDocumentForm
            className='size-full'
            initialDocuments={documents}
            onUpdateStart={() => {
              setUpdateError(null);
              setUpdating(true);
            }}
            onUpdateEnd={(errorMessage) => {
              if (errorMessage) {
                toast.error('Some thing went wrong!');
                reloadList().then();
                setUpdateError(errorMessage);
                setUpdating(false);
              } else {
                toast.success('Updated!');
                setUpdateError(null);
                setUpdating(false);
                reloadList().then();
              }
            }}
          />
          {!!updateError && (
            <p className='text-destructive'>
              Something went wrong in the last update, new state has been
              reloaded.
              <br />
              Last update error: {updateError}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentSetting;
