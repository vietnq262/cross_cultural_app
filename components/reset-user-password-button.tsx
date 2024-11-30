'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import RequiredInputLabelMarker from '@/components/required-input-label-marker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn, generatePasswordHash } from '@/lib/utils';

import { Button } from './ui/button';

type FormValue = {
  salt: string;
  newPassword: string;
};

const formSchema = z.object({
  salt: z.string().trim(),
  newPassword: z.string().trim().min(6),
});

const ResetUserPasswordSettingButton = (props: {}) => {
  const [isOpen, setOpen] = useState(false);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salt: '',
      newPassword: '',
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='' variant='outline'>
          <KeyIcon className='mr-2 size-4' />
          <span>Update user password</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='flex h-full max-w-screen-sm flex-col gap-0 p-0 md:h-auto'>
        <DialogHeader className='p-4'>
          <DialogTitle>Generate new password hash</DialogTitle>
          <DialogDescription>
            Generate a new password hash for a user, using the salt (from user
            table) and new raw password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className={cn('@container flex w-full min-w-0 flex-col')}
            onSubmit={form.handleSubmit(
              async ({ salt, newPassword }) => {
                const hash = await generatePasswordHash(newPassword, salt);
                setPasswordHash(hash);
              },
              (e) => console.error(e),
            )}
          >
            <div className='w-full flex-1 gap-4 space-y-4 overflow-auto p-4'>
              <FormField<FormValue, 'salt'>
                control={form.control}
                name='salt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Salt <RequiredInputLabelMarker />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<FormValue, 'newPassword'>
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      New password <RequiredInputLabelMarker />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-row justify-center gap-2'>
              <Button type='submit' className='gap-2'>
                Generate
              </Button>
            </div>
          </form>
        </Form>

        <div className='mb-6 mt-4 px-4'>
          <Input
            value={passwordHash || ''}
            placeholder='Generated hash will appear here'
            readOnly
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetUserPasswordSettingButton;
