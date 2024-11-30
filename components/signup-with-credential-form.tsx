'use client';

import { FormEvent, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { signup, SignUpData } from '@/app/auth/sign-up/actions';
import RequiredInputLabelMarker from '@/components/required-input-label-marker';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getMessageFromCode, SignUpDataSchema } from '@/lib/types';

import { SpinnerIcon } from './ui/icons';

const SignUpFormSchema = SignUpDataSchema.extend({
  passwordConfirm: z.string().min(6),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords must match',
  path: ['passwordConfirm'],
});

type SignUpFormValue = z.infer<typeof SignUpFormSchema>;

export default function SignupWithCredentialForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const doSignUp = (data: SignUpData) =>
    startTransition(() => {
      signup(data).then((result) => {
        if (result) {
          if (result.type === 'error') {
            toast.error(getMessageFromCode(result.resultCode));
          } else {
            toast.success(getMessageFromCode(result.resultCode));
            router.refresh();
          }
        }
      });
    });

  const form = useForm<SignUpFormValue>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const submitHandler = (e: FormEvent) => {
    e.stopPropagation();
    return form.handleSubmit(doSignUp, (er) => {
      form.setError('root', { message: '[ERROR]' + er });
    })(e);
  };

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={submitHandler}>
        <fieldset className='space-y-3' disabled={isPending}>
          <FormField<SignUpFormValue, 'name'>
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name
                  <RequiredInputLabelMarker />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<SignUpFormValue, 'username'>
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username
                  <RequiredInputLabelMarker />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<SignUpFormValue, 'password'>
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password
                  <RequiredInputLabelMarker />
                </FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<SignUpFormValue, 'passwordConfirm'>
            control={form.control}
            name='passwordConfirm'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm your password
                  <RequiredInputLabelMarker />
                </FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <FormMessage id='root' />
        <Button className='w-full' type='submit' disabled={isPending}>
          {isPending ? <SpinnerIcon /> : 'Create account'}
        </Button>
      </form>
    </Form>
  );
}
