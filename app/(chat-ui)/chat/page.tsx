import { redirect } from 'next/navigation';

import { generateId } from 'ai';

import { auth, Session } from '@/auth';
import { ChatWindow } from '@/components/chat-window';
import { AssistantAIProvider } from '@/lib/chat/assistant-ai-actions';

export const dynamic = 'force-dynamic';

export default async function NewChatPage() {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    redirect(`/auth/sign-in?next=/chat`);
  }

  const id = generateId();

  return (
    <AssistantAIProvider initialAIState={{ id: id, messages: [] }}>
      <ChatWindow className='h-full' />
    </AssistantAIProvider>
  );
}
