import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  GetEssayHistoriesResponse,
} from '@/app/api/essays/[essay-id]/histories/route';

const getEssayHistories = async (
  essayId: string,
): Promise<GetEssayHistoriesResponse> => {
  const response = await fetch(`/api/essays/${essayId}/histories`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return (await response.json()) as GetEssayHistoriesResponse;
};

export const useEssayHistoriesQuery = (essayId: string) =>
  useQuery({
    queryKey: ['essays', essayId, 'histories'],
    queryFn: () => getEssayHistories(essayId),
  });
