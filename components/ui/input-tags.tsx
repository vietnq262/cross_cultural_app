'use client';

import * as React from 'react';

import { XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { type InputProps } from './input';

type SelectTagInputProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string[];
  onChange: (value: string[]) => void;
};

const SelectTagInput = React.forwardRef<HTMLInputElement, SelectTagInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [edittingTag, setEdittingTag] = React.useState('');

    return (
      <div className={cn('relative', className)}>
        <div
          className={cn(
            'has-[:focus-visible]:outline-none has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-0 min-h-10 flex w-full flex-wrap gap-2 rounded-md border border-inpput px-3 py-2 text-sm  disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {(value || []).map((tag) => (
            <Badge
              key={tag}
              variant='secondary'
              className='border-transparent border hover:border-primary'
            >
              {tag}
              <Button
                variant='ghost'
                size='icon'
                type='button'
                className='ml-2 size-3 hover:text-destructive'
                onClick={() => onChange(value.filter((i) => i !== tag))}
              >
                <XIcon className='w-3' />
              </Button>
            </Badge>
          ))}
          <input
            className={cn(
              'flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
            )}
            value={edittingTag}
            placeholder={
              !value.length
                ? 'Enter text then press enter or comma to add tag'
                : ''
            }
            onChange={(e) => {
              setEdittingTag(e.target.value);
            }}
            onKeyDown={(e) => {
              switch (e.key) {
                case 'Enter':
                case ',':
                  e.preventDefault();
                  if (edittingTag.length > 0) {
                    onChange([...value, edittingTag.trim()]);
                    setEdittingTag('');
                  }
                  break;
                case 'Backspace':
                  if (edittingTag.length === 0 && value.length > 0) {
                    e.preventDefault();
                    const prevTag = value[value.length - 1];
                    setEdittingTag(prevTag);
                    onChange(value.slice(0, -1));
                  }
                  break;
                default:
                  break;
              }
            }}
            onBlur={() => {
              if (edittingTag.length > 0) {
                onChange([...value, edittingTag.trim()]);
                setEdittingTag('');
              }
            }}
            {...props}
            ref={ref}
          />
        </div>
      </div>
    );
  },
);

SelectTagInput.displayName = 'SelectTagInput';

export { SelectTagInput };
