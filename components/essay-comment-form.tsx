'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAddEssayCommentMutation } from '@/lib/client-api-service/essay-comment';

interface EssayCommentFormProps {
  essayId: string;
  onCommented?: () => void;
}

export default function EssayCommentForm(props: EssayCommentFormProps) {
  const {
    isPending,
    error,
    mutate: addComment,
  } = useAddEssayCommentMutation(props.essayId, props.onCommented);

  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) {
      return;
    }
    addComment(content);
    setNewComment('');
  };

  return (
    <div className=''>
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder='Add a comment...'
          value={newComment}
          disabled={isPending}
          onChange={(e) => setNewComment(e.target.value)}
          className='mb-2'
          rows={5}
        />
        <div className='flex justify-end'>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
        {!!error && (
          <p className='text-center text-destructive'>{error.message}</p>
        )}
      </form>
    </div>
  );
}
