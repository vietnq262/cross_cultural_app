'use client';

import * as React from 'react';

import { signIn } from 'next-auth/react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { GitHubIcon, SpinnerIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface LoginButtonProps extends ButtonProps {
  showGithubIcon?: boolean;
  text?: string;
}

export function LoginButton({
  text = 'Login with GitHub',
  showGithubIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Button
      variant='outline'
      onClick={() => {
        setIsLoading(true);
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('github', { callbackUrl: `/` });
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <SpinnerIcon className='mr-2 animate-spin' />
      ) : showGithubIcon ? (
        <GitHubIcon className='mr-2' />
      ) : null}
      {text}
    </Button>
  );
}
