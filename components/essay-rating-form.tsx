'use client';

import { useState } from 'react';

import { Loader2Icon, StarIcon } from 'lucide-react';

import { useEssayRatingMutation } from '@/lib/client-api-service/essay-rating';

type EssayRatingFormProps = {
  essayId: string;
  ratedScore?: number;
  onRated?: () => void;
};

export default function EssayRatingForm(props: EssayRatingFormProps) {
  const {
    isPending,
    error,
    mutate: submitEssayRating,
  } = useEssayRatingMutation(props.essayId, props.onRated);

  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleMouseEnter = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = async (rating: number) => {
    setSelectedRating(rating);
    submitEssayRating(rating);
  };

  return (
    <div>
      <div className='flex justify-center mb-4'>
        {[...Array(10)].map((_, index) => {
          const rating = index + 1;
          return (
            <button
              key={rating}
              className={`p-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full ${
                isPending ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(rating)}
              disabled={isPending}
              aria-label={`Rate ${rating} out of 10`}
            >
              <StarIcon
                className={`size-8 ${
                  rating <= (hoveredRating || selectedRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {!!selectedRating && (
        <div className='flex justify-center items-center'>
          {isPending && (
            <>
              <Loader2Icon className='size-6 animate-spin text-blue-500' />
              <span className='ml-2 text-blue-500'>Submitting...</span>
            </>
          )}
          {!!error && (
            <p className='text-center text-destructive'>{error.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
