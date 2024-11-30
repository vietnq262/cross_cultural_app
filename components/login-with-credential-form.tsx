'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { authenticate } from '@/app/auth/action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getMessageFromCode } from '@/lib/types';

import { SpinnerIcon } from './ui/icons';

export default function LoginWithCredentialForm() {
  const router = useRouter();
  const [result, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode));
      } else {
        toast.success(getMessageFromCode(result.resultCode));
        router.refresh();
      }
    }
  }, [result, router]);

  return (
    <form action={dispatch} className='space-y-4'>
      <div className='space-y-3'>
        <div className='w-full space-y-1'>
          <Label htmlFor='username'>Username</Label>
          <Input
            id='username'
            name='username'
            placeholder='Enter your username'
            required
          />
        </div>
        <div className='w-full space-y-1'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            name='password'
            placeholder='Enter password'
            required
            minLength={6}
          />
        </div>
      </div>
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className='w-full' type='submit' disabled={pending}>
      {pending ? <SpinnerIcon /> : 'Log in'}
    </Button>
  );
}
