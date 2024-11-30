'use client';

import { useUpdateEssayMutation } from '@/lib/client-api-service/essay';
import { Essay, EssayDetailFormValue } from '@/lib/types';

import EssayDetailForm from './essay-detail-form';

interface UpdateEssayFormProps {
  essay: Essay;
  onUpdated?: () => void;
}

export default function UpdateEssayForm({
  essay,
  onUpdated,
}: UpdateEssayFormProps) {
  const {
    isPending,
    error,
    mutate: updateEssay,
  } = useUpdateEssayMutation(essay.id, onUpdated);

  const onSubmit = async (data: EssayDetailFormValue) => {
    updateEssay({
      title: data.title,
      introduction: data.introduction,
      body: data.body,
      conclusion: data.conclusion,
    });
  };

  return (
    <>
      <EssayDetailForm
        initialValue={{
          videoId: essay.videoId,
          title: essay.title,
          introduction: essay.introduction,
          body: essay.body,
          conclusion: essay.conclusion,
        }}
        onSubmit={onSubmit}
        isPending={isPending}
      />
      {!!error && (
        <p className='text-center text-destructive text-sm py-2'>
          {error.message}
        </p>
      )}
    </>
  );
}
