'use client';

import { useRouter } from 'next/navigation';

import { PenIcon, TrashIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { SessionUserData } from '@/auth';
import EssayCommentSection from '@/components/essay-comment-section';
import EssayRatingSection from '@/components/essay-rating-section';
import { useEssayQuery } from '@/lib/client-api-service/essay';
import { useVideoQuery } from '@/lib/client-api-service/videos';

import { DeleteEssayButton } from './delete-essay-button';
import { EssayHistoriesViewerButton } from './essay-histories-viewer-button';
import EssayViewer from './essay-viewer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { SkeletonText } from './ui/skeleton';
import UpdateEssayButton from './update-essay-button';
import VideoName from './video-name';

type EssayDetailPageProps = {
  essayId: string;
};

export default function EssayDetailPage({ essayId }: EssayDetailPageProps) {
  const { data: session } = useSession();

  const router = useRouter();

  const { isPending, error, data: essay, refetch } = useEssayQuery(essayId);

  const isOwner = essay && session?.user && essay.createdBy === session.user.id;
  const isAdmin = session?.user && (session.user as SessionUserData).is_admin;
  const canUpdate = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;
  const canViewHistory = isOwner;

  if (isPending) {
    return (
      <div className='container py-4 text-center text-lg animate-pulse'>
        Loading...
      </div>
    );
  }

  if (!essay) {
    return (
      <div className='container py-4 text-center text-lg text-destructive'>
        {error?.message || 'Essay not found'}
      </div>
    );
  }

  return (
    <div className='container space-y-8 py-8 relative'>
      <div className='space-y-8 py-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={
                  isPending || !essay.videoId ? '' : `/video/${essay.videoId}`
                }
              >
                {isPending || !essay.videoId ? (
                  <SkeletonText className='w-24 h-4' />
                ) : (
                  <VideoName videoId={essay.videoId} />
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{essay.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <EssayViewer essay={essay} />
      </div>

      <div className='flex justify-end gap-4'>
        {canUpdate && (
          <div className='flex justify-end'>
            <UpdateEssayButton
              variant='outline'
              size='sm'
              essay={essay}
              onUpdated={() => refetch()}
            >
              <PenIcon className='size-4 mr-2' />
              <span>Update essay</span>
            </UpdateEssayButton>
          </div>
        )}

        {canViewHistory && (
          <EssayHistoriesViewerButton
            variant='outline'
            size='sm'
            essay={essay}
          />
        )}

        {canDelete && (
          <DeleteEssayButton
            variant='outline'
            size='sm'
            essay={essay}
            onDeleted={() => {
              toast.success('Essay deleted successfully');
              router.back();
            }}
          >
            <TrashIcon className='size-4 mr-2' />
            <span>Delete essay</span>
          </DeleteEssayButton>
        )}
      </div>

      <EssayRatingSection
        className='bg-card border rounded-md p-4 mx-auto w-full md:max-w-screen-sm'
        essayId={essay.id}
      />

      <EssayCommentSection className='w-full' essayId={essayId} />
    </div>
  );
}
