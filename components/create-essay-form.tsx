'use client';

import { toast } from 'sonner';

import {
  CreateEssayRequest,
  CreateEssayResponse,
  Essay,
  EssayDetailFormValue,
} from '@/lib/types';

import EssayDetailForm from './essay-detail-form';

interface CreateEssayFormProps {
  initialVideoId?: string;
  onCreated?: (essay: Essay) => void;
}

export default function CreateEssayForm({
  initialVideoId,
  onCreated,
}: CreateEssayFormProps) {
  const onSubmit = async (data: EssayDetailFormValue) => {
    try {
      const requestData: CreateEssayRequest = {
        videoId: data.videoId,
        title: data.title,
        introduction: data.introduction,
        body: data.body,
        conclusion: data.conclusion,
      };
      const response = await fetch('/api/essays', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
      const essay = (await response.json()) as CreateEssayResponse;
      onCreated?.(essay);
    } catch (error) {
      console.error('Error creating essay:', error);
      toast.error('Failed to create essay. Please try again.');
    }
  };

  return (
    <EssayDetailForm
      initialValue={{
        videoId: initialVideoId || '',
        title: '',
        introduction: '',
        body: '',
        conclusion: '',
      }}
      onSubmit={onSubmit}
    />
  );
}
