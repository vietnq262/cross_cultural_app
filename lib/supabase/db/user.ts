import 'server-only';

import { supabaseAuthAdapter } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isPasswordMatched } from '@/lib/utils';

export async function getUserByUsername(username: string) {
  const supabaseClient = createSupabaseServerClient();
  const { data, error } = await supabaseClient
    .schema('next_auth')
    .from('users')
    .select('*')
    .eq('username', username)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to find user: ${error.message}`);
  }

  return data;
}

export async function getUserByCredential(username: string, password: string) {
  const user = await getUserByUsername(username);

  if (!user || !user.password) return null;

  const isMatched = await isPasswordMatched(
    password,
    user.password,
    user.salt || '',
  );

  if (isMatched) {
    return user;
  } else {
    return null;
  }
}

export async function createUser(userData: {
  name: string;
  username: string;
  password: string;
  salt: string;
}) {
  const id = crypto.randomUUID();
  const user = await supabaseAuthAdapter.createUser!({
    id: id,
    name: userData.name,
    username: userData.username,
    password: userData.password,
    salt: userData.salt,
    emailVerified: null,
  } as any);

  return user;
}
