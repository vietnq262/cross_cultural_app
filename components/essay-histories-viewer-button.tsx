import * as React from 'react';
import { useState } from 'react';

import { FileClockIcon } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Essay } from '@/lib/types';

import { EssayHistoriesViewer } from './essay-histories-viewer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface Props extends ButtonProps {
  essay: Essay;
}

export function EssayHistoriesViewerButton({ essay, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' {...props}>
          <FileClockIcon className='size-4 mr-2' />
          <span>Essay history</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='h-full max-w-screen-lg md:h-auto md:max-h-[90vh] flex flex-col p-0 gap-0'>
        <DialogHeader className='p-4'>
          <DialogTitle>Essay history</DialogTitle>
        </DialogHeader>
        <EssayHistoriesViewer className='flex-1 min-h-0' essay={essay} />
      </DialogContent>
    </Dialog>
  );
}
