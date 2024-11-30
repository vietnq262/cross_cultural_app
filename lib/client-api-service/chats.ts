// import {
//   keepPreviousData,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { getChats } from '../server-actions';

// import {
//   Chat,
// } from '@/lib/types';

// async function getListChats(
//   params?: ListChatParams,
// ): Promise<ListChatResponse> {
//   const query = new URLSearchParams();

//   if (params?.pageSize) query.append('pageSize', params?.pageSize.toString());
//   if (params?.pageIndex)
//     query.append('pageIndex', params?.pageIndex.toString());
//   if (params?.search) query.append('search', params?.search);
//   if (params?.videoId) query.append('videoId', params?.videoId);
//   if (params?.videoTag) query.append('videoTag', params?.videoTag);
//   if (params?.authorId) query.append('authorId', params?.authorId);

//   const response = await fetch(`/api/chats?${query.toString()}`);
//   if (!response.ok) {
//     const errorBody = await response.json();
//     throw new Error(
//       errorBody.error || `HTTP error! status: ${response.status}`,
//     );
//   }

//   return (await response.json()) as ListChatResponse;
// }

// async function getChat(essayId: string): Promise<Chat | null> {
//   const response = await fetch(`/api/chats/${essayId}`);
//   if (!response.ok) {
//     const errorBody = await response.json();
//     throw new Error(
//       errorBody.error || `HTTP error! status: ${response.status}`,
//     );
//   }
//   return (await response.json()) as Chat;
// }

// async function updateChat(essayId: string, data: UpdateChatRequest) {
//   const response = await fetch(`/api/chats/${essayId}`, {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const errorBody = await response.json();
//     throw new Error(
//       errorBody.error || `HTTP error! status: ${response.status}`,
//     );
//   }
//   return;
// }

export const useListChatQuery = () =>
  useQuery({
    queryKey: ['chats'],
    queryFn: () => getChats(),
    gcTime: 1000 * 60, // 1 minute
  });

// export const useChatQuery = (essayId: string) =>
//   useQuery({
//     queryKey: ['chats', essayId],
//     queryFn: () => getChat(essayId),
//   });

// export const useUpdateChatMutation = (
//   essayId: string,
//   onSuccess?: () => void,
// ) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: ['chats', essayId],
//     mutationFn: (data: UpdateChatRequest) => updateChat(essayId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['chats', essayId] });
//       onSuccess?.();
//     },
//   });
// };
