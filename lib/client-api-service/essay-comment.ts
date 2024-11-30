import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CommentEssayRequest,
  GetEssayCommentsResponse,
} from '@/app/api/essays/[essay-id]/comments/route';

const getEssayComments = async (
  essayId: string,
): Promise<GetEssayCommentsResponse> => {
  const response = await fetch(`/api/essays/${essayId}/comments`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return (await response.json()) as GetEssayCommentsResponse;
};

const addEssayComment = async (
  essayId: string,
  content: string,
): Promise<void> => {
  const requestData: CommentEssayRequest = {
    content: content,
  };

  const response = await fetch(`/api/essays/${essayId}/comments`, {
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

export const useEssayCommentsQuery = (essayId: string) =>
  useQuery({
    queryKey: ['comments', essayId],
    queryFn: () => getEssayComments(essayId),
  });

export const useAddEssayCommentMutation = (
  essayId: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addEssayComment(essayId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', essayId] });
      onSuccess?.();
    },
  });
};
