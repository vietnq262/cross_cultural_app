import { PropsWithChildren } from 'react';

import { generateId } from 'ai';

import GlobalAssistableLayout from '@/components/global-assistable-layout';
import { Header } from '@/components/header';
import { AssistantAIProvider } from '@/lib/chat/assistant-ai-actions';
import { getUIStateFromAIState } from '@/lib/chat/utils';
import { getCurrentUserActiveChat } from '@/lib/server-actions';

export default async function AssistableLayout(props: PropsWithChildren) {
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
    <div className='flex h-screen flex-col'>
      <Header showAssistantToggle />
      <AssistantAIProvider
        initialAIState={initialAIState}
        initialUIState={initialUIState}
      >
        <GlobalAssistableLayout className='min-h-0 flex-1'>
          {props.children}
        </GlobalAssistableLayout>
      </AssistantAIProvider>
    </div>
  );
}
