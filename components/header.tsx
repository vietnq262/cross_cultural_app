import { Suspense } from 'react';

import Link from 'next/link';

import { auth, Session, SessionUserData } from '@/auth';
import { Button } from '@/components/ui/button';
import { AppIcon } from '@/components/ui/icons';
import { UserMenu } from '@/components/user-menu';

import GlobalAssistantToggleButton from './global-assistant-toogle-button';
// import { ThemeToggle } from './theme-toggle';

export function Header(props: { showAssistantToggle?: boolean }) {
  return (
    <header className='sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl'>
      <Suspense fallback={<div className='flex-1 overflow-auto' />}>
        <UserOrLogin showAssistantToggle={props.showAssistantToggle} />
      </Suspense>
    </header>
  );
}

async function UserOrLogin(props: { showAssistantToggle?: boolean }) {
  const session = (await auth()) as Session | null;

  if (!!session?.user) {
    return (
      <div className='flex w-full flex-row items-center gap-4'>
        <Link href='/'>
          <AppIcon className='size-6' />
        </Link>
        {/* <ThemeToggle /> */}
        <Link className='hidden md:block text-sm' href='/'>
          Essays
        </Link>
        <Link className='hidden md:block text-sm' href='/video'>
          Videos
        </Link>
        <Link className='hidden md:block text-sm' href='/chat'>
          AI Chatbot
        </Link>
        <div className='flex-1' />
        {props.showAssistantToggle && <GlobalAssistantToggleButton />}
        <UserMenu user={session.user as SessionUserData} />
      </div>
    );
  } else {
    return (
      <div className='flex w-full flex-row items-center gap-4'>
        <Link href='/'>
          <AppIcon className='size-6' />
        </Link>
        {/* <ThemeToggle /> */}
        <div className='flex-1' />
        <Button variant='link' asChild className='-ml-2'>
          <Link href='/auth/sign-in'>Login</Link>
        </Button>
      </div>
    );
  }
}
