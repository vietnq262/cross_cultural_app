import {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useRef,
} from 'react';

import { LoaderIcon } from 'lucide-react';
import Textarea from 'react-textarea-autosize';

import { Button } from '@/components/ui/button';
import { ArrowElbowIcon, PlusIcon } from '@/components/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import { cn } from '@/lib/utils';

export function PromptForm({
  input,
  onInputChange,
  isLoading,
  onSubmit,
}: {
  input: string;
  onInputChange: ChangeEventHandler<HTMLTextAreaElement>;
  isLoading?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClickNew: MouseEventHandler<HTMLButtonElement>;
}) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <div className='relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background pr-12 sm:rounded-md border-t'>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder='Send a message.'
          className='min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm'
          autoFocus
          spellCheck={false}
          autoComplete='off'
          autoCorrect='off'
          name='message'
          rows={1}
          value={input}
          onChange={onInputChange}
          disabled={isLoading}
        />
        <SubmitMessageButton
          className='absolute top-4 right-4'
          isLoading={isLoading}
          disabled={input === '' || isLoading}
        />
      </div>
    </form>
  );
}

function SubmitMessageButton(props: {
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={props.className}
          type='submit'
          size='icon'
          disabled={props.disabled}
        >
          {props.isLoading ? (
            <LoaderIcon className='animate-spin' />
          ) : (
            <ArrowElbowIcon />
          )}
          <span className='sr-only'>Send message</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Send message</TooltipContent>
    </Tooltip>
  );
}
