import * as React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { ArrowDownIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface ButtonScrollToBottomProps extends ButtonProps {
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ButtonScrollToBottom({
  className,
  isAtBottom,
  scrollToBottom,
  ...props
}: ButtonScrollToBottomProps) {
  return (
    <Button
      variant='outline'
      size='icon'
      className={cn(
        'transition-opacity duration-300 sm:right-8 md:bottom-2',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className,
      )}
      onClick={() => scrollToBottom()}
      {...props}
    >
      <ArrowDownIcon />
      <span className='sr-only'>Scroll to bottom</span>
    </Button>
  );
}
