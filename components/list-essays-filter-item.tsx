'use client';

import { PropsWithChildren } from 'react';

import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ListEssaysFilterItem extends PropsWithChildren {
  onClickRemove: () => void;
}

export default function ListEssaysFilterItem(props: ListEssaysFilterItem) {
  return (
    <div className='inline-flex gap-2 items-center border w-auto p-1 pl-2 rounded-full text-sm'>
      {props.children}
      <Button
        className='rounded-full size-6'
        size='icon'
        variant='destructive-outline'
        onClick={props.onClickRemove}
      >
        <XIcon className='size-4' />
      </Button>
    </div>
  );
}
