import { useState } from 'react';

import { Essay } from '@/lib/types';

import { Button, ButtonProps } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import UpdateEssayForm from './update-essay-form';

interface UpdateEssayButtonProps extends Omit<ButtonProps, 'onClick'> {
  essay: Essay;
  onUpdated?: () => void;
}

export default function UpdateEssayButton({
  essay,
  onUpdated,
  ...otherButtonProps
}: UpdateEssayButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          {...otherButtonProps}
          onClick={() => setIsDialogOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className='size-full max-w-full flex flex-col p-0'>
        <DialogHeader className='p-4'>
          <DialogTitle>
            Update essay &quot;<strong>{essay.title}</strong>&quot;
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='flex-1 min-h-0 p-4'>
          <div className='container'>
            <UpdateEssayForm
              essay={essay}
              onUpdated={() => {
                setIsDialogOpen(false);
                onUpdated?.();
              }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
