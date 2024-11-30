'use client';

import { MouseEventHandler } from 'react';

import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { PlusIcon } from '@/components/ui/icons';
import { useListChatQuery } from '@/lib/client-api-service/chats';
import { Chat } from '@/lib/types';
import { cn } from '@/lib/utils';

import { SidebarItems } from './sidebar-items';
import { useSidebar } from './ui/sidebar';

interface ChatHistoryProps {
  overrideOnClickNewChatLink?: MouseEventHandler<HTMLAnchorElement>;
  overrideOnClickChatLink?: (
    chat: Chat,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => void;
}

export function ChatHistory({
  overrideOnClickNewChatLink,
  overrideOnClickChatLink,
}: ChatHistoryProps) {
  const {
    data: chats,
    isPending: isLoading,
    refetch: refreshChats,
  } = useListChatQuery();

  const { setOpen, setOpenMobile } = useSidebar();

  const closeSidebar = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between p-4 gap-4'>
        <h4 className='text-sm font-medium'>Chat History</h4>
        {/* refresh chat button */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            refreshChats();
          }}
        >
          Refresh chat
        </Button>
      </div>
      <div className='mb-2 px-2'>
        <Link
          href='/chat'
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'w-full justify-start',
          )}
          onClick={(e) => {
            closeSidebar();
            overrideOnClickNewChatLink?.(e);
          }}
        >
          <PlusIcon className='-translate-x-2 stroke-2' />
          New Chat
        </Link>
      </div>

      {isLoading ? (
        <div className='flex flex-1 flex-col space-y-4 overflow-auto px-4'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className='h-6 w-full shrink-0 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800'
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-1 flex-col overflow-hidden'>
          <div className='flex-1 overflow-auto py-2'>
            {chats?.length ? (
              <div className='space-y-2 px-2'>
                <SidebarItems
                  chats={chats}
                  overrideOnClickChatLink={(chat, e) => {
                    closeSidebar();
                    overrideOnClickChatLink?.(chat, e);
                  }}
                />
              </div>
            ) : (
              <div className='p-8 text-center'>
                <p className='text-sm text-muted-foreground'>No chat history</p>
              </div>
            )}
          </div>
          <div className='flex items-center justify-between p-4'></div>
        </div>
      )}
    </div>
  );
}
