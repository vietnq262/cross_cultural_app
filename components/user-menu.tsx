import Link from 'next/link';

import {
  FileIcon,
  LogOut,
  MessageCircleIcon,
  VideotapeIcon,
} from 'lucide-react';
import { Session } from 'next-auth';

import { SessionUserData, signOut } from '@/auth';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SettingsIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export interface UserMenuProps {
  user: SessionUserData;
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ');
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <div className='flex items-center justify-between'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='px-1'>
            <span className='mr-2 hidden md:block'>{user!.name}</span>
            <Avatar
              className={cn(
                'size-7 border',
                user!.is_admin && 'border border-primary',
              )}
            >
              <AvatarImage src={user!.image!} />
              <AvatarFallback>{getUserInitials(user!.name!)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={8} align='end' className='w-fit'>
          <DropdownMenuItem className='flex-col items-start'>
            <p className='text-xs text-muted-foreground'>
              <span>{user!.name}</span>
              {!!user!.is_admin && <span className='ml-1'>(Admin)</span>}
            </p>
          </DropdownMenuItem>
          <Link href='/' className='cursor-pointer'>
            <DropdownMenuItem>
              <FileIcon className='mr-2 size-4' />
              <span>Essays</span>
            </DropdownMenuItem>
          </Link>
          <Link href='/video' className='cursor-pointer'>
            <DropdownMenuItem>
              <VideotapeIcon className='mr-2 size-4' />
              <span>Videos</span>
            </DropdownMenuItem>
          </Link>
          <Link href='/chat' className='cursor-pointer'>
            <DropdownMenuItem>
              <MessageCircleIcon className='mr-2 size-4' />
              <span>AI Chatbot</span>
            </DropdownMenuItem>
          </Link>

          {!!user!.is_admin && (
            <>
              <DropdownMenuSeparator />
              <Link href='/setting/system' className='cursor-pointer'>
                <DropdownMenuItem>
                  <SettingsIcon className='mr-2 size-4' />
                  <span>System settings</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          <DropdownMenuSeparator />

          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button
              className={cn(
                buttonVariants({
                  variant: 'destructive-outline',
                  size: 'sm',
                  className: 'w-full font-normal border-0 px-2 py-1.5',
                }),
              )}
            >
              <LogOut className='mr-2 size-4' />
              <span className='flex-1 text-start'>Log out</span>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
