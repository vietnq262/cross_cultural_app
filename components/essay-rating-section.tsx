'use client';

import { PropsWithChildren } from 'react';

import { toast } from 'sonner';

import { GetEssayRatingsResponse } from '@/app/api/essays/[essay-id]/ratings/route';
import EssayRatingForm from '@/components/essay-rating-form';
import EssayRatingResult from '@/components/essay-rating-result';
import { Skeleton } from '@/components/ui/skeleton';
import { useEssayRatingQuery } from '@/lib/client-api-service/essay-rating';
import { cn } from '@/lib/utils';

type EssayRatingSectionProps = {
  className?: string;
  essayId: string;
};

export default function EssayRatingSection(props: EssayRatingSectionProps) {
  const {
    isPending,
    error,
    data: ratingData,
    refetch,
  } = useEssayRatingQuery(props.essayId);

  const onRated = () => {
    toast.success('Success');
    refetch().then();
  };

  return (
    <section className={cn('space-y-4', props.className)}>
      <h2 className='font-bold w-full text-center'>Essay rating</h2>
      <div className='flex flex-col items-center gap-2'>
        {isPending ? (
          <RatingSectionLoadingContent />
        ) : error ? (
          <RatingSectionErrorContent>{error.message}</RatingSectionErrorContent>
        ) : !ratingData ? (
          <RatingSectionErrorContent>Unknown error</RatingSectionErrorContent>
        ) : (
          <RatingSectionContent
            essayId={props.essayId}
            ratingData={ratingData}
            onRated={onRated}
          />
        )}
      </div>
    </section>
  );
}

function RatingSectionLoadingContent() {
  return (
    <>
      <Skeleton className='w-full md:max-w-sm h-10 rounded' />
      <Skeleton className='w-full md:max-w-sm h-6 rounded' />
      <Skeleton className='w-32 h-4 rounded' />
    </>
  );
}

function RatingSectionErrorContent(props: PropsWithChildren) {
  return <p className='text-destructive text-center'>{props.children}</p>;
}

function RatingSectionContent({
  essayId,
  ratingData,
  onRated,
}: {
  essayId: string;
  ratingData: GetEssayRatingsResponse;
  onRated?: () => void;
}) {
  const isUserRated = !!ratingData.ratedScore;
  return (
    <div>
      {isUserRated ? (
        <div>
          <EssayRatingResult score={ratingData.avgScore} />
          <p className='text-center'>
            <strong>{ratingData.numberOfRate}</strong> rating(s) with an average
            score of <strong>{ratingData.avgScore?.toFixed(1)}</strong>/10
          </p>
          <p className='text-center text-sm text-muted-foreground'>
            You rated: <strong>{ratingData.ratedScore}</strong>
          </p>
        </div>
      ) : (
        <EssayRatingForm essayId={essayId} onRated={onRated} />
      )}
    </div>
  );
}
