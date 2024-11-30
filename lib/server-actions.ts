'use server';

import 'server-only';

import { revalidatePath } from 'next/cache';

import { auth, Session } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Chat } from '@/lib/types';

export async function getChats() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return [];
  }

  try {
    const supabaseClient = createSupabaseServerClient();
    const { data } = await supabaseClient
      .from('chats')
      .select('payload')
      .order('payload->createdAt', { ascending: false })
      .eq('user_id', userId)
      .throwOnError();
    return data?.map((entry) => entry.payload as Chat) ?? [];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string) {
  const supabaseClient = createSupabaseServerClient();
  const { data } = await supabaseClient
    .from('chats')
    .select('payload')
    .eq('id', id)
    .maybeSingle()
    .throwOnError();

  if (!data) {
    return null;
  }

  return data.payload as Chat;
}

export async function saveChat(userId: string, id: string, chat: Chat) {
  const supabaseClient = createSupabaseServerClient();
  const { data, error } = await supabaseClient
    .from('chats')
    .upsert({ id, payload: chat, user_id: userId })
    .throwOnError();
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    const supabaseClient = createSupabaseServerClient();
    await supabaseClient.from('chats').delete().eq('id', id).throwOnError();

    revalidatePath('/');
    return revalidatePath(path);
  } catch (error) {
    return {
      error: 'Unauthorized',
    };
  }
}

export async function clearChats() {
  try {
    const supabaseClient = createSupabaseServerClient();
    await supabaseClient.from('chats').delete().throwOnError();
    revalidatePath('/');
  } catch (error) {
    console.log('clear chats error', error);
    return {
      error: 'Unauthorized',
    };
  }
}

export async function getSharedChat(id: string, bypassSharedCheck = false) {
  const supabaseClient = createSupabaseServerClient();

  if (bypassSharedCheck) {
    const { data } = await supabaseClient
      .from('chats')
      .select('payload')
      .eq('id', id)
      .maybeSingle()
      .throwOnError();
    return (data?.payload as Chat) ?? null;
  } else {
    const { data } = await supabaseClient
      .from('chats')
      .select('payload')
      .eq('id', id)
      .not('payload->sharePath', 'is', null)
      .maybeSingle()
      .throwOnError();

    return (data?.payload as Chat) ?? null;
  }
}

export async function shareChat(chatId: string) {
  const supabaseClient = createSupabaseServerClient();
  const { data: chat, error } = await supabaseClient
    .from('chats')
    .select('payload')
    .eq('id', chatId)
    .single();

  if (error) {
    throw error;
  }

  const payload = chat?.payload as Chat;

  if (!payload) {
    throw 'Not found';
  }

  const newPayload: Chat = {
    id: payload.id,
    title: payload.title,
    createdAt: payload.createdAt,
    userId: payload.userId,
    path: payload.path,
    messages: payload.messages,
    sharePath: `/share/${chatId}`,
  };

  await supabaseClient
    .from('chats')
    .update({ payload: newPayload })
    .eq('id', chatId)
    .throwOnError();

  return newPayload;
}

export async function setCurrentUserActiveChat(chatId: string | null) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    throw new Error('User not found');
  }

  const supabaseClient = createSupabaseServerClient();
  const { error } = await supabaseClient
    .schema('next_auth')
    .from('users')
    .update({ active_chat_id: chatId })
    .eq('id', session.user.id);

  if (error) {
    throw new Error(`Failed to update: ${error.message}`);
  }

  return;
}

export async function getCurrentUserActiveChat(): Promise<Chat | null> {
  'use server';

  const session = (await auth()) as Session | null;

  if (!session?.user) {
    throw new Error('User not found');
  }

  const supabaseClient = createSupabaseServerClient();
  const { data, error } = await supabaseClient
    .schema('next_auth')
    .from('users')
    .select('active_chat_id')
    .eq('id', session.user.id)
    .single();

  if (error) {
    throw new Error(`Failed to get: ${error.message}`);
  }

  const lastActiveChat = data.active_chat_id;

  if (!lastActiveChat) {
    return null;
  } else {
    return getChat(lastActiveChat);
  }
}
