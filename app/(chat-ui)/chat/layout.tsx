import { PropsWithChildren } from 'react';

import { ChatHistory } from '@/components/chat-history';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function ChatLayout(props: PropsWithChildren) {
  return (
    <div className='h-screen flex flex-col'>
      <SidebarProvider>
        <Sidebar className='min-h-0 flex-row flex-1 flex'>
          <ChatHistory />
        </Sidebar>
        <main className='size-full relative'>
          <SidebarTrigger className='absolute top-4 z-10 left-4 bg-card shadow' />
          <div className='h-full border border-red-5 z-0'>{props.children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
