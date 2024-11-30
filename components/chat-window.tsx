'use client';

import { FormEventHandler, useState } from 'react';

import { generateId } from 'ai';
import { useActions, useUIState } from 'ai/rsc';

import { EmptyScreen } from '@/components/empty-screen';
import {
  AssistantAIProvider,
  ClientMessage,
} from '@/lib/chat/assistant-ai-actions';
import { getMessageDisplay } from '@/lib/chat/utils';
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';

import { ButtonScrollToBottom } from './button-scroll-to-bottom';
import { PromptForm } from './prompt-form';

export function ChatWindow(props: { className?: string }) {
  const [uiState, setUIState] = useUIState<typeof AssistantAIProvider>();
  const { submitUserMessageToLangchainAgent: submitUserMessage } =
    useActions<typeof AssistantAIProvider>();

  const [input, setInput] = useState<string>('');

  const handleSubmitMessage: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setInput('');

    const message: Message = {
      id: generateId(),
      role: 'user',
      content: input,
    };
    const userMessage: ClientMessage = {
      ...message,
      display: getMessageDisplay(message),
    };
    setUIState((state) => ({
      ...state,
      messages: [...state.messages, userMessage],
    }));

    const aiMessage = await submitUserMessage(input);

    setUIState((state) => ({
      ...state,
      messages: [...state.messages, aiMessage],
    }));
  };

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div className={cn('@container flex flex-col', props.className)}>
      <div className={cn('min-h-0 flex-1 overflow-y-auto')} ref={scrollRef}>
        <div className='flex flex-col items-start gap-4 p-4' ref={messagesRef}>
          {uiState.messages.length ? (
            uiState.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'max-w-[90%] rounded-md border p-2',
                  message.role == 'user' && 'self-end',
                )}
              >
                {message.display}
              </div>
            ))
          ) : (
            <EmptyScreen />
          )}
        </div>
        <div className='h-px w-full' ref={visibilityRef} />
      </div>
      <div className='relative'>
        <ButtonScrollToBottom
          className='absolute right-4 bottom-20 z-10'
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
        />
        <PromptForm
          input={input}
          onInputChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmitMessage}
          onClickNew={() => {}}
        />
      </div>
    </div>
  );
}
