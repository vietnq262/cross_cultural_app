import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth, Session } from '@/auth';
import { User } from 'next-auth';

export type GetUserResponse = User;

// Get essay detail
export async function GET(
  req: NextRequest,
  { params }: { params: { 'user-id': string } },
) {
  const userId = params['user-id'];

  if (!userId) {
    return NextResponse.json(
      { error: 'You must provide a userId.' },
      { status: 404 },
    );
  }

  const session = (await auth()) as Session | null;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = createSupabaseServerClient();

    const { data, error } = await client
      .schema('next_auth')
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response: GetUserResponse = {
      id: data.id,
      name: data.name,
      email: data.email,
      image: data.image,
    }
    return NextResponse.json(response, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}