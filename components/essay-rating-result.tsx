import { Star } from 'lucide-react';

interface RatingBarProps {
  score: number;
}

export default function EssayRatingResult({ score }: RatingBarProps) {
  // Ensure the score is between 0 and 10
  const clampedScore = Math.max(0, Math.min(10, score));

  // Calculate the number of full and partial stars
  const fullStars = Math.floor(clampedScore);
  const partialStar = clampedScore % 1;

  return (
    <div className='flex flex-col items-center space-y-2'>
      <div
        className='flex'
        aria-label={`Rating: ${clampedScore.toFixed(1)} out of 10 stars. ${fullStars} full stars, ${partialStar > 0 ? '1 partial star,' : ''} ${10 - Math.ceil(clampedScore)} empty stars.`}
      >
        {[...Array(10)].map((_, index) => (
          <div key={index} className='relative'>
            <Star className='size-8 text-muted' strokeWidth={1.5} />
            <div
              className='absolute top-0 left-0 overflow-hidden'
              style={{
                width:
                  index < fullStars
                    ? '100%'
                    : index === fullStars
                      ? `${partialStar * 100}%`
                      : '0%',
              }}
            >
              <Star
                className={`size-8 ${index < fullStars ? 'text-yellow-400' : 'text-yellow-200'}`}
                fill='currentColor'
                strokeWidth={1.5}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
