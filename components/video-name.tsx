import { useVideoQuery } from '@/lib/client-api-service/videos';

import { SkeletonText } from './ui/skeleton';

export default function VideoName({ videoId }: { videoId: string }) {
  const { isPending: isLoadingVideos, data: video } = useVideoQuery(videoId);

  if (isLoadingVideos) {
    return <SkeletonText className='w-24 h-4' />;
  }

  return <>{video?.name || 'unknown video'}</>;
}
