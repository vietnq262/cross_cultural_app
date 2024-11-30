import { PropsWithChildren } from 'react';

import { Header } from '@/components/header';

export default function ChatLayout(props: PropsWithChildren) {
  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='min-h-0 flex-1'>{props.children}</div>
    </div>
  );
}
