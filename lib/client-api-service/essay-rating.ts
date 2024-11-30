import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  GetEssayRatingsResponse,
  RateEssayRequest,
} from '@/app/api/essays/[essay-id]/ratings/route';

const getEssayRating = async (
  essayId: string,
): Promise<GetEssayRatingsResponse> => {
  const response = await fetch(`/api/essays/${essayId}/ratings`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return (await response.json()) as GetEssayRatingsResponse;
};

const rateEssay = async (essayId: string, score: number): Promise<void> => {
  const requestData: RateEssayRequest = {
    score: score,
  };

  const response = await fetch(`/api/essays/${essayId}/ratings`, {
    method: 'POST',
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return;
};

export const useEssayRatingQuery = (essayId: string) =>
  useQuery({
    queryKey: ['ratings', essayId],
    queryFn: () => getEssayRating(essayId),
  });

export const useEssayRatingMutation = (
  essayId: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (score: number) => rateEssay(essayId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', essayId] });
      onSuccess?.();
    },
  });
};
