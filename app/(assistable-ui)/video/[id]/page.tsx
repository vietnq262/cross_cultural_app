import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';

import { auth, Session } from '@/auth';

interface VideoDetailPageProps {
  params: {
    id: string;
  };
}

export default async function VideoDetailPage(props: VideoDetailPageProps) {
  const videoId = props.params.id;
  if (!videoId) {
    return notFound();
  }

  const session = (await auth()) as Session | null;

  if (!session?.user) {
    redirect(`/auth/sign-in?next=/video/${videoId}`);
  }

  return <VideoDetail videoId={videoId} />;
}

const VideoDetail = dynamic(() => import('@/components/video-detail'), {
  ssr: false,
});
