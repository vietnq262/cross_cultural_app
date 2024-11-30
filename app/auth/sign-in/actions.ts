'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { AuthResult, AuthResultCode } from '@/lib/types';

export async function authenticate(
  _prevState: AuthResult | undefined,
  formData: FormData,
): Promise<AuthResult | undefined> {
  try {
    const username = formData.get('username');
    const password = formData.get('password');
    await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
    return {
      type: 'success',
      resultCode: AuthResultCode.UserLoggedIn,
    };
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
    }
  }
}
