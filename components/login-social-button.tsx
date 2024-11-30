import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';

interface LoginSocialButtonProps extends PropsWithChildren {
  className?: string;
  providerId: 'google' | 'microsoft-entra-id';
}

export default function LoginSocialButton(
  props: LoginSocialButtonProps,
  children: React.ReactNode | undefined = props.children,
) {
  return (
    <form
      key={props.providerId}
      action={async () => {
        'use server';
        try {
          await signIn(props.providerId);
        } catch (error) {
          // Signin can fail for a number of reasons, such as the user
          // not existing, or the user not having the correct role.
          // In some cases, you may want to redirect to a custom error
          if (error instanceof AuthError) {
            return redirect(`/auth/fail?error=${error.type}`);
          }

          // Otherwise if a redirects happens NextJS can handle it
          // so you can just re-thrown the error and let NextJS handle it.
          // Docs:
          // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
          throw error;
        }
      }}
    >
      <Button className={props.className} type='submit' variant='outline'>
        {children}
      </Button>
    </form>
  );
}
