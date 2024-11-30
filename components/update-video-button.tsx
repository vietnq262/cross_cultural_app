import { useState } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { VideoFileData } from '@/lib/types';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import UpdateVideoForm from './update-video-form';

interface UpdateVideoButtonProps extends Omit<ButtonProps, 'onClick'> {
  video: VideoFileData;
  onUpdated?: () => void;
}

export function UpdateVideoButton(props: UpdateVideoButtonProps) {
  const { className, video, onUpdated, ...otherProps } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpening) => {
        if (!isOpening) {
          setIsOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className={cn('', className)}
          variant='outline'
          type='button'
          {...otherProps}
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className='h-full max-w-screen-sm md:h-auto md:max-h-[90vh] flex flex-col p-0 gap-0'>
        <DialogHeader className='p-4'>
          <DialogTitle>
            Update video <br />
          </DialogTitle>
        </DialogHeader>
        <div className='flex-1 min-h-0 overflow-y-auto p-4'>
          <UpdateVideoForm
            initialVideo={video}
            onUpdated={() => {
              setIsOpen(false);
              onUpdated?.();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
