'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { createUser, getUserByUsername } from '@/lib/supabase/db/user';
import { AuthResult, AuthResultCode, SignUpDataSchema } from '@/lib/types';
import { generatePasswordHash, generateRandomPasswordSalt } from '@/lib/utils';

export type SignUpData = {
  name: string;
  username: string;
  password: string;
};

export async function signup(
  data: SignUpData,
): Promise<AuthResult | undefined> {
  const parsedCredentials = SignUpDataSchema.safeParse(data);

  if (parsedCredentials.success) {
    const { name, username, password } = data;

    const salt = generateRandomPasswordSalt();
    const hashedPassword = await generatePasswordHash(password, salt);

    try {
      const existingUser = await getUserByUsername(username);

      if (existingUser) {
        return {
          type: 'error',
          resultCode: AuthResultCode.UserAlreadyExists,
        };
      } else {
        const user = await createUser({
          name: name,
          username: username,
          password: hashedPassword,
          salt: salt,
        });
        await signIn('credentials', {
          username,
          password,
          redirect: false,
        });
        return {
          type: 'success',
          resultCode: AuthResultCode.UserCreated,
        };
      }
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
              type: 'error',
              resultCode: AuthResultCode.InvalidCredentials,
            };
          default:
            return {
              type: 'error',
              resultCode: AuthResultCode.UnknownError,
            };
        }
      } else {
        return {
          type: 'error',
          resultCode: AuthResultCode.UnknownError,
        };
      }
    }
  } else {
    return {
      type: 'error',
      resultCode: AuthResultCode.InvalidCredentials,
    };
  }
}
