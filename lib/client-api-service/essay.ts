import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  Essay,
  ListEssayParams,
  ListEssayResponse,
  UpdateEssayRequest,
} from '@/lib/types';

async function getListEssays(
  params?: ListEssayParams,
): Promise<ListEssayResponse> {
  const query = new URLSearchParams();

  if (params?.pageSize) query.append('pageSize', params?.pageSize.toString());
  if (params?.pageIndex)
    query.append('pageIndex', params?.pageIndex.toString());
  if (params?.search) query.append('search', params?.search);
  if (params?.videoId) query.append('videoId', params?.videoId);
  if (params?.videoTag) query.append('videoTag', params?.videoTag);
  if (params?.authorId) query.append('authorId', params?.authorId);

  const response = await fetch(`/api/essays?${query.toString()}`);
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return (await response.json()) as ListEssayResponse;
}

async function getEssay(essayId: string): Promise<Essay | null> {
  const response = await fetch(`/api/essays/${essayId}`);
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }
  return (await response.json()) as Essay;
}

async function updateEssay(essayId: string, data: UpdateEssayRequest) {
  const response = await fetch(`/api/essays/${essayId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }
  return;
}

async function deleteEssay(essayId: string) {
  const response = await fetch(`/api/essays/${essayId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return;
}

export const useListEssayQuery = (params?: ListEssayParams) =>
  useQuery({
    queryKey: ['essays', params],
    queryFn: () => getListEssays(params),
    placeholderData: keepPreviousData,
  });

export const useEssayQuery = (essayId: string) =>
  useQuery({
    queryKey: ['essays', essayId],
    queryFn: () => getEssay(essayId),
  });

export const useUpdateEssayMutation = (
  essayId: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['essays', essayId],
    mutationFn: (data: UpdateEssayRequest) => updateEssay(essayId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays', essayId] });
      onSuccess?.();
    },
  });
};

export const useDeleteEssayMutation = (
  essayId: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['essays', essayId],
    mutationFn: () => deleteEssay(essayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays', essayId] });
      onSuccess?.();
    },
  });
};
