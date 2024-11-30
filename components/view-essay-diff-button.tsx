import * as React from 'react';
import { useState } from 'react';

import ReactDiffViewer from 'react-diff-viewer-continued';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Essay } from '@/lib/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface Props extends ButtonProps {
  className?: string;
  essayLeft: Essay;
  essayLeftLabel: string;
  essayRight: Essay;
  essayRightLabel: string;
}

export function ViewEssayDiffButton({
  className,
  essayLeft,
  essayLeftLabel,
  essayRight,
  essayRightLabel,
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' {...props} />
      </DialogTrigger>
      <DialogContent className='h-full max-w-screen-lg md:h-auto md:max-h-[90vh] flex flex-col p-0 gap-0'>
        <DialogHeader className='p-4'>
          <DialogTitle>
            Essay version comparison: {essayLeftLabel} vs {essayRightLabel}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='min-h-0 flex-1 overflow-auto'>
          <div className='space-y-4 p-4'>
            <div className='space-y-2'>
              <p>Title</p>
              <ReactDiffViewer
                oldValue={essayLeft.title}
                newValue={essayRight.title}
                splitView={true}
              />
            </div>
            <div className='space-y-2'>
              <p>Introduction</p>
              <ReactDiffViewer
                oldValue={essayLeft.introduction}
                newValue={essayRight.introduction}
                splitView={true}
              />
            </div>
            <div className='space-y-2'>
              <p>Body</p>
              <ReactDiffViewer
                oldValue={essayLeft.body}
                newValue={essayRight.body}
                splitView={true}
              />
            </div>
            <div className='space-y-2'>
              <p>Conclusion</p>
              <ReactDiffViewer
                oldValue={essayLeft.conclusion}
                newValue={essayRight.conclusion}
                splitView={true}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
