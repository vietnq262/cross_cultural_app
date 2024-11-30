'use client';

import { PropsWithChildren } from 'react';

import { toast } from 'sonner';

import { GetEssayCommentsResponse } from '@/app/api/essays/[essay-id]/comments/route';
import EssayAuthorInfo from '@/components/essay-author-info';
import EssayCommentForm from '@/components/essay-comment-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useEssayCommentsQuery } from '@/lib/client-api-service/essay-comment';
import { cn } from '@/lib/utils';

type EssayCommentSectionProps = {
  className?: string;
  essayId: string;
};

export default function EssayCommentSection(props: EssayCommentSectionProps) {
  const {
    isPending,
    error,
    data: ratingData,
    refetch,
  } = useEssayCommentsQuery(props.essayId);

  const onCommented = () => {
    toast.success('Success');
    refetch().then();
  };

  return (
    <section className={cn('space-y-4', props.className)}>
      <h2 className='text-2xl font-serif mb-4 border-b pb-2'>Comments</h2>
      <EssayCommentForm essayId={props.essayId} onCommented={onCommented} />
      <div className='space-y-2'>
        {isPending ? (
          <CommentListLoading />
        ) : error ? (
          <CommentListError>{error.message}</CommentListError>
        ) : !ratingData ? (
          <CommentListError>Unknown error</CommentListError>
        ) : (
          <CommentList
            essayId={props.essayId}
            data={ratingData}
            onCommented={onCommented}
          />
        )}
      </div>
    </section>
  );
}

function CommentListLoading() {
  return (
    <>
      <Skeleton className='w-full md:max-w-sm h-10 rounded' />
      <Skeleton className='w-full md:max-w-sm h-6 rounded' />
      <Skeleton className='w-32 h-4 rounded' />
    </>
  );
}

function CommentListError(props: PropsWithChildren) {
  return <p className='text-destructive text-center'>{props.children}</p>;
}

function CommentList({
  data,
}: {
  essayId: string;
  data: GetEssayCommentsResponse;
  onCommented?: () => void;
}) {
  return (
    <ol className='flex flex-col-reverse gap-4'>
      {data.comments.map((comment) => (
        <li
          key={comment.id}
          className='p-3 bg-card rounded-md border shadow-sm'
        >
          <div className='flex items-center mb-2 gap-2'>
            <EssayAuthorInfo userId={comment.createdBy} />
            <p className='text-xs text-gray-500'>
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
          <p className='text-gray-700 mb-2'>{comment.content}</p>
        </li>
      ))}
    </ol>
  );
}
