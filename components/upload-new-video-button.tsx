import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from '@/components/ui/icons';
import { VideoFileData } from '@/lib/types';

import { Button } from './ui/button';
import UploadVideoForm from './upload-video-form';

interface Props {
  userId: string;
  onDone?: (video: VideoFileData) => void;
  onCancel?: () => void;
}

export default function UploadNewVideoButton(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' onClick={() => setIsOpen(true)}>
          <PlusIcon className='mr-2' />
          <span>Upload new video</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='h-full max-w-screen-sm md:h-auto md:max-h-[90vh] flex flex-col p-0 gap-0'>
        <DialogHeader className='p-4'>
          <DialogTitle>Upload new video</DialogTitle>
        </DialogHeader>
        <UploadVideoForm
          className='flex-1 min-h-0 overflow-y-auto p-4'
          uploadPath={props.userId}
          onDone={(video) => {
            setIsOpen(false);
            props.onDone?.(video);
          }}
          onCancel={() => {
            setIsOpen(false);
            props.onCancel?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
