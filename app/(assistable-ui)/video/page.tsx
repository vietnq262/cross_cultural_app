import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { auth, Session } from '@/auth';

const ListVideos = dynamic(() => import('@/components/list-videos'), {
  ssr: false,
});

export default async function VideoSettingPage() {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    redirect(`/auth/sign-in?next=/video`);
  }

  return <ListVideos userId={session.user.id} />;
}
