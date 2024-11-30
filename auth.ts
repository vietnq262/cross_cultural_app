import 'server-only';

import { SupabaseAdapter } from '@auth/supabase-adapter';
import NextAuth, { Session as NASession, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';

import { getUserByCredential } from '@/lib/supabase/db/user';

export type SessionUserData = User & {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  image?: string;
  is_admin?: boolean;
};

export type Session = NASession & {
  user?: SessionUserData;
};

export const supabaseAuthAdapter = SupabaseAdapter({
  url: process.env.SUPABASE_URL,
  secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const GoogleAuthProvider = Google({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
});

const UsernamePasswordAuthProvider = Credentials({
  async authorize(credentials) {
    const parsedCredentials = z
      .object({
        username: z.string().trim(),
        password: z.string().trim().min(6),
      })
      .safeParse(credentials);

    if (!parsedCredentials.success) {
      return null;
    }

    const { username, password } = parsedCredentials.data;
    const matchedUser = await getUserByCredential(username, password);

    if (!matchedUser) {
      return null;
    } else {
      return matchedUser
    }
  },
});

const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: supabaseAuthAdapter,
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  providers: [GoogleAuthProvider, UsernamePasswordAuthProvider],
  pages: {
    signIn: '/auth/sign-in',
    newUser: '/auth/sign-up',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user,
        };
      } else {
        return token;
      }
    },
    session({ session, token }: { session: any; token: any }) {
      return {
        ...session,
        user: token.user,
      };
    },
  },
});

export { auth, signIn, signOut, handlers };
