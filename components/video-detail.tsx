'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FilePenLine, FileSearchIcon, PenIcon, TrashIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { SessionUserData } from '@/auth';
import { DeleteVideoButton } from '@/components/delete-video-button';
import { useVideoQuery } from '@/lib/client-api-service/videos';
import { supabaseClient } from '@/lib/supabase/client';

import EssayAuthorInfo from './essay-author-info';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { UpdateVideoButton } from './update-video-button';

export default function VideoDetail(props: { videoId: string }) {
  const { videoId } = props;

  const { data: session } = useSession();

  const router = useRouter();

  const { isPending, error, data: video, refetch } = useVideoQuery(videoId);

  const isOwner =
    video && session?.user && video.created_by === session.user.id;
  const isAdmin = session?.user && (session.user as SessionUserData).is_admin;
  const canUpdate = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  return (
    <div className='space-y-4 py-6 container'>
      <h1 className='text-2xl font-bold'>{video?.name || 'Video detail'}</h1>

      {isPending ? (
        <div className='space-y-2'>
          <Skeleton className='w-full h-12' />
          <Skeleton className='w-full h-12' />
          <Skeleton className='w-full h-12' />
          <Skeleton className='w-full h-12' />
          <Skeleton className='w-full h-12' />
          <Skeleton className='w-full h-12' />
        </div>
      ) : error ? (
        <div className='flex size-full flex-col items-center justify-center p-4'>
          <p className='text-destructive'>
            {error.message || 'Unknown error!'}
          </p>
          <Button
            variant='outline'
            size='sm'
            className='mx-auto mt-2'
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      ) : !!video ? (
        <>
          <div className='space-y-4'>
            {!!video.deleted_at && (
              <p className='text-xs text-destructive w-full p-4 border border-destructive rounded-md'>
                <span>This video has been deleted</span>
              </p>
            )}
            <p className='flex items-center gap-2'>
              <strong>Uploaded by: </strong>
              <EssayAuthorInfo userId={video.created_by} />
            </p>
            <p>
              <span className='mr-2'>Tags:</span>
              {!!video.tags?.length ? (
                <>
                  {video.tags.map((tag) => (
                    <Link
                      href={{
                        pathname: '/',
                        query: {
                          tag: tag,
                        },
                      }}
                      key={tag}
                      legacyBehavior
                    >
                      <Button variant='outline' size='sm' className='mr-2'>
                        {tag}
                      </Button>
                    </Link>
                  ))}
                </>
              ) : (
                <span>N/A</span>
              )}
            </p>
            <div>
              <p className='mb-1'>Description:</p>
              <p className='border rounded-md bg-muted p-4 whitespace-pre-wrap'>
                {video.description}
              </p>
            </div>

            <div>
              <p className='mb-1'>Preview video:</p>
              <video
                className='rounded-md mx-auto h-96'
                src={
                  !!video.deleted_at
                    ? ''
                    : supabaseClient.storage
                        .from('documents')
                        .getPublicUrl(video.path).data.publicUrl
                }
                controls
                preload='none'
              />
            </div>

            <div>
              <p className='mb-1'>Preview audio</p>
              <audio
                className='w-full'
                src={
                  !!video.deleted_at
                    ? ''
                    : supabaseClient.storage
                        .from('documents')
                        .getPublicUrl(video.audio_file_path).data.publicUrl
                }
                controls
                preload='none'
              />
            </div>

            <div>
              <p className='mb-1'>Transcribe</p>
              <p className='border rounded-md bg-muted p-4 whitespace-pre-wrap'>
                {video.transcribe_text}
              </p>
            </div>
          </div>

          <div className='flex justify-end w-full gap-2 flex-wrap'>
            <Link href={`/?video=${video.id}`}>
              <Button size='sm' variant='outline'>
                <FileSearchIcon className='size-4 mr-2' />
                <span>Find all essays from this video</span>
              </Button>
            </Link>
            {!video.deleted_at && (
              <>
                <Link href={`/essay/new?videoId=${video.id}`}>
                  <Button size='sm' variant='outline'>
                    <FilePenLine className='size-4 mr-2' />
                    <span>Write new essay from this video</span>
                  </Button>
                </Link>

                {canUpdate && (
                  <UpdateVideoButton
                    video={video}
                    onUpdated={() => {
                      toast.success('Video updated successfully');
                      refetch();
                    }}
                  >
                    <PenIcon className='size-4 mr-2' />
                    <span>Update video information</span>
                  </UpdateVideoButton>
                )}

                {canDelete && (
                  <DeleteVideoButton
                    video={video}
                    onDeleted={() => {
                      toast.success('Essay deleted successfully');
                      router.back();
                    }}
                  >
                    <TrashIcon className='size-4 mr-2' />
                    <span>Delete video</span>
                  </DeleteVideoButton>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div className='flex size-full flex-col items-center justify-center p-4'>
          <p className='text-muted'>Not found</p>
        </div>
      )}
    </div>
  );
}
