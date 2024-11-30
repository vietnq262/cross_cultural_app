'use client';

import { useGlobalAppState } from '@/lib/global-app-state';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { AIIcon } from './ui/icons';

export default function GlobalAssistantToggleButton({
  className,
}: {
  className?: string;
}) {
  const { isAssistantOpen, setIsOpen } = useGlobalAppState();
  return (
    <Button
      variant={isAssistantOpen ? 'default' : 'outline'}
      className={cn('p-2 rounded-full', className)}
      onClick={() => setIsOpen(!isAssistantOpen)}
    >
      <AIIcon className='size-4' />
      <span className='hidden md:block mx-2'>Assistant</span>
    </Button>
  );
}
