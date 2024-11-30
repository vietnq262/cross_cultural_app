'use client';

import { generateId } from 'ai';

import GlobalAssistantUI from '@/components/global-assistant-ui';
import { AssistantAIProvider } from '@/lib/chat/assistant-ai-actions';
import { getUIStateFromAIState } from '@/lib/chat/utils';
import { getCurrentUserActiveChat } from '@/lib/server-actions';

export default async function GlobalAssistableLayoutDrawer({
  className,
}: {
  className?: string;
}) {
  const initialAIState = await getCurrentUserActiveChat()
    .catch(() => null)
    .then(
      (chat) =>
        chat || {
          id: generateId(),
          messages: [],
        },
    );
  const initialUIState = getUIStateFromAIState(initialAIState);
  return (
    <AssistantAIProvider
      initialAIState={initialAIState}
      initialUIState={initialUIState}
    >
      <GlobalAssistantUI className='h-full w-screen max-w-screen-sm md:max-w-[512px] overflow-y-auto md:border-l' />
    </AssistantAIProvider>
  );
}
