'use client';

import { ReactNode } from 'react';

import GlobalAssistantUI from '@/components/global-assistant-ui';
import { useGlobalAppState } from '@/lib/global-app-state';
import { cn } from '@/lib/utils';

import ClassicDrawerLayout from './classic-drawer-layout';

export default function GlobalAssistableLayout({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { isAssistantOpen } = useGlobalAppState();

  return (
    <ClassicDrawerLayout
      className={cn('', className)}
      drawerContent={
        <GlobalAssistantUI className='h-full w-screen max-w-screen-sm md:max-w-[512px] overflow-y-auto md:border-l' />
      }
      drawerSide='right'
      isOpen={isAssistantOpen}
    >
      {children}
    </ClassicDrawerLayout>
  );
}
