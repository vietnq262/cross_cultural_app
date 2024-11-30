'use client';

import { Fragment } from 'react';

import Link from 'next/link';

import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { useListVideoQuery } from '@/lib/client-api-service/videos';
import { formatFileSizeText } from '@/lib/utils';

import EssayAuthorInfo from './essay-author-info';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import UploadNewVideoButton from './upload-new-video-button';

const ListVideos = (props: { userId: string }) => {
  const { isPending, error, data: videos, refetch } = useListVideoQuery();

  return (
    <div className='space-y-4 py-6 container @container'>
      <h1 className='text-2xl font-bold'>Videos</h1>

      <div className='flex justify-end w-full gap-2'>
        <UploadNewVideoButton
          userId={props.userId}
          onDone={() => {
            toast.success('Video uploaded successfully');
          }}
        />
      </div>

      <div className='gap-4 py-4 grid @3xl:grid-cols-3'>
        {isPending ? (
          <>
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
          </>
        ) : error ? (
          <div className='col-span-full text-center py-4 space-y-4'>
            <p className='text-destructive'>
              {error.message || 'Something went wrong'}
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
        ) : (
          <>
            {(videos || []).map((video, index) => (
              <Card
                key={index}
                className='@container hover:shadow-lg transition-shadow flex flex-col'
              >
                <CardHeader>
                  <CardTitle className='text-xl'>{video.name}</CardTitle>
                  <div className='text-sm text-muted-foreground space-y-1'>
                    <p className='flex items-center gap-2'>
                      <strong>Uploaded by: </strong>
                      <EssayAuthorInfo userId={video.created_by} />
                    </p>
                    <p>
                      <strong className='mr-2'>Tags:</strong>
                      {video.tags?.length > 0
                        ? video.tags.map((tag, tagIndex) => (
                            <Fragment key={tag}>
                              {tagIndex !== 0 && <span>, </span>}
                              <span className='py-0.5'>{tag}</span>
                            </Fragment>
                          ))
                        : 'N/A'}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      File size: {formatFileSizeText(video.file_size)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className='flex-1 flex flex-col'>
                  <p className='line-clamp-3'>
                    {video.description || video.transcribe_text}
                  </p>
                </CardContent>
                <CardFooter className='flex justify-end gap-2'>
                  <Button variant='outline' size='sm' type='button'>
                    <Link href={`/video/${video.id}`}>View detail</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ListVideos;
