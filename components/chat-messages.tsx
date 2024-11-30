'use client';

import { ReactNode } from 'react';

import { StreamableValue } from 'ai/rsc';
import { HammerIcon } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { toast } from 'sonner';

import MessageFeedback from '@/components/chat-message-feedback';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AIIcon,
  DebugIcon,
  InfoIcon,
  SpinnerIcon,
  UserIcon,
} from '@/components/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useStreamableText } from '@/lib/hooks/use-streamable-text';
import { AssistantMessageSourceDocument, MessageToolCall } from '@/lib/types';
import { cn } from '@/lib/utils';

import { MemoizedReactMarkdown } from './markdown';
import { CodeBlock } from './ui/codeblock';

export function MarkDownMessageViewer({
  className,
  content,
}: {
  className?: string;
  content: string;
}) {
  return (
    <MemoizedReactMarkdown
      className={cn(
        'prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0',
        className,
      )}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return (
            <p className='mb-2 whitespace-pre-line last:mb-0'>{children}</p>
          );
        },
        code({ node, inline, className, children, ...props }) {
          if (children.length) {
            if (children[0] == '▍') {
              return (
                <span className='mt-1 animate-pulse cursor-default'>▍</span>
              );
            }

            children[0] = (children[0] as string).replace('`▍`', '▍');
          }

          const match = /language-(\w+)/.exec(className || '');

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ''}
              value={String(children).replace(/\n$/, '')}
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  );
}

export function UserMessage({
  className,
  content,
}: {
  className?: string;
  content: string;
}) {
  // add support for tool used
  return (
    <div
      className={cn(
        'group relative flex items-start gap-2',
        'flex-row-reverse',
        className,
      )}
    >
      <div className='flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm'>
        <UserIcon />
      </div>
      <MarkDownMessageViewer content={content} />
    </div>
  );
}

export function BotMessage({
  content,
  runId,
  feedbackId,
  sources,
  tools,
  className,
}: {
  content: string | StreamableValue<string>;
  runId?: string;
  feedbackId?: string;
  sources?: AssistantMessageSourceDocument[];
  tools?: MessageToolCall[];
  className?: string;
}) {
  const text = useStreamableText(content);

  return (
    <div
      className={cn('group relative flex items-start gap-2 px-1', className)}
    >
      <div className='flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm'>
        <AIIcon />
      </div>
      <div className='flex-1 space-y-2 overflow-hidden'>
        <MarkDownMessageViewer content={text} />
        <div className='flex flex-row gap-2'>
          {/* srouce viewer */}
          <Collapsible>
            <div className='flex w-full justify-end gap-1'>
              {!!sources?.length && (
                <Tooltip>
                  <CollapsibleTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        className='size-6 p-1 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground'
                        variant='outline'
                        size='icon'
                      >
                        <InfoIcon />
                        <span className='sr-only'>View sources</span>
                      </Button>
                    </TooltipTrigger>
                  </CollapsibleTrigger>
                  <TooltipContent>View sources</TooltipContent>
                </Tooltip>
              )}

              {!!runId && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className='size-6 p-1'
                        variant='outline'
                        size='icon'
                        onClick={async (e) => {
                          try {
                            const response = await fetch(
                              `/api/trace?run_id=${runId}`,
                            );
                            if (!response.ok) {
                              toast.error('Error when fetching trace data');
                            } else {
                              const data = (await response.json()) as any;
                              window.open(data.url, '_blank');
                            }
                          } catch (e) {
                            toast.error('Error when fetching trace data');
                          }
                        }}
                      >
                        <DebugIcon />
                        <span className='sr-only'>View trace</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View trace</TooltipContent>
                  </Tooltip>
                  <MessageFeedback
                    runId={runId}
                    feedbackId={feedbackId}
                    // onFeedbackAdded={onFeedbackAdded}
                  />
                </>
              )}
            </div>
            <CollapsibleContent>
              <code className='mt-4 block'>
                <ol className='space-y-3 text-xs'>
                  {tools?.map((tool, i) => (
                    <li className='mt-2' key={'tool:' + tool.id || i}>
                      <p className='mb-1 font-semibold'>
                        {i + 1}. {tool.name}
                      </p>
                    </li>
                  ))}
                </ol>
              </code>
            </CollapsibleContent>
          </Collapsible>

          {/* tool viewer */}
          {!!tools?.length && (
            <Collapsible>
              <div className='flex w-full justify-end gap-1'>
                <Tooltip>
                  <CollapsibleTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        className='size-6 p-1 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground'
                        variant='outline'
                        size='icon'
                      >
                        <HammerIcon />
                        <span className='sr-only'>View tools used</span>
                      </Button>
                    </TooltipTrigger>
                  </CollapsibleTrigger>
                  <TooltipContent>View tools used</TooltipContent>
                </Tooltip>
              </div>
              <CollapsibleContent>
                <code className='mt-4 block'>
                  <ol className='space-y-3 text-xs'>
                    {tools?.map((tool, i) => (
                      <li className='mt-2' key={'tool:' + tool.id || i}>
                        <p className='mb-1 font-semibold'>
                          {i + 1}. {tool.name} {tool.input}
                        </p>
                        <div>{tool.output}</div>
                      </li>
                    ))}
                  </ol>
                </code>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  );
}

export function SystemMessage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('group relative flex items-start gap-2 px-1', className)}
    >
      <div className='flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm'>
        <AIIcon />
      </div>
      <div className='flex-1 space-y-2 overflow-hidden'>{children}</div>
    </div>
  );
}

export function BotSpinnerMessage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('group relative flex items-start gap-2 px-1', className)}
    >
      <div className='flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm'>
        <AIIcon />
      </div>
      <div className='flex-1 space-y-2 overflow-hidden'>
        <SpinnerIcon className='mr-2 inline-block h-[0.75em] w-auto align-baseline' />
        {children}
      </div>
    </div>
  );
}
