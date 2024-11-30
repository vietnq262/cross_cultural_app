import { notFound, redirect } from 'next/navigation';

import { auth, Session } from '@/auth';
import { ChatWindow } from '@/components/chat-window';
import { AssistantAIProvider } from '@/lib/chat/assistant-ai-actions';
import { getChat } from '@/lib/server-actions';

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    redirect(`/auth/sign-in?next=/chat/${params.id}`);
  }

  const chat = await getChat(params.id);

  if (!chat) {
    return notFound();
  }

  if (chat?.userId !== session?.user?.id) {
    return notFound();
  }

  return (
    <AssistantAIProvider initialAIState={chat}>
      <ChatWindow className='h-full' />
    </AssistantAIProvider>
  );
}
