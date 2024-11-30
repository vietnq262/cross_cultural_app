'use client';

import { Fragment } from 'react';

import Link from 'next/link';

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

import ListEssaysFilterItem from '@/components/list-essays-filter-item';
import ListingPagination from '@/components/listing-pagination';
import SearchInput from '@/components/search-input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useListEssayQuery } from '@/lib/client-api-service/essay';
import { useVideoQuery } from '@/lib/client-api-service/videos';
import {
  LIST_ESSAY_DEFAULT_PAGE_SIZE,
  ListEssayResponseItem,
} from '@/lib/types';

import EssayAuthorInfo from './essay-author-info';

export default function ListEssays() {
  const [pageNumber, setPageNumber] = useQueryState(
    'page',
    parseAsInteger.withDefault(1),
  );
  const [video, setVideo] = useQueryState('video', parseAsString);
  const [tag, setTag] = useQueryState('tag', parseAsString);
  const [author, setAuthor] = useQueryState('author', parseAsString);
  const [search, setSearch] = useQueryState('search', parseAsString);

  const pageIndex = pageNumber - 1;
  const setPageIndex = (pageIndex: number) => setPageNumber(pageIndex + 1);
  const pageSize = LIST_ESSAY_DEFAULT_PAGE_SIZE;

  const { error, isLoading, data } = useListEssayQuery({
    pageIndex,
    pageSize,
    authorId: author || undefined,
    search: search || undefined,
    videoTag: tag || undefined,
    videoId: video || undefined,
  });

  const essays = data?.items || [];
  const essayTotalCount = data?.total || 0;

  const pageStartIndex = pageIndex * pageSize;
  let pageEndIndex = pageStartIndex + pageSize;
  if (pageEndIndex > essayTotalCount - 1) {
    pageEndIndex = essayTotalCount - 1;
  }

  return (
    <div className='@container space-y-4 py-4'>
      <SearchInput
        value={search || ''}
        onChange={(value) => setSearch(value || null)}
      />
      <div className='space-x-1'>
        {!!search && (
          <ListEssaysFilterItem
            onClickRemove={() => {
              setSearch(null).then();
            }}
          >
            <span>Keyword:</span>
            <span>{search}</span>
          </ListEssaysFilterItem>
        )}
        {!!video && (
          <ListEssaysFilterItem
            onClickRemove={() => {
              setVideo(null).then();
            }}
          >
            <span>About video:</span>
            <VideoName videoId={video} />
          </ListEssaysFilterItem>
        )}
        {!!tag && (
          <ListEssaysFilterItem
            onClickRemove={() => {
              setTag(null).then();
            }}
          >
            <span>Tag:</span>
            <strong>{tag}</strong>
          </ListEssaysFilterItem>
        )}
        {!!author && (
          <ListEssaysFilterItem
            onClickRemove={() => {
              setAuthor(null).then();
            }}
          >
            <span>Written by:</span>
            <EssayAuthorInfo userId={author} />
          </ListEssaysFilterItem>
        )}
      </div>
      <div className='gap-4 py-4 grid @3xl:grid-cols-3'>
        {isLoading ? (
          <>
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
            <Skeleton className='h-64 rounded-md w-full' />
          </>
        ) : error ? (
          <div className='container py-4 text-center text-lg text-destructive'>
            {error.message || 'Something went wrong'}
          </div>
        ) : (
          <>
            <div className='col-span-full'>
              <div className='text-sm text-muted-foreground'>
                Showing results {pageStartIndex + 1}-{pageEndIndex + 1} of{' '}
                {essayTotalCount} result(s)
              </div>
              <ListingPagination
                pageSize={pageSize}
                pageIndex={pageIndex}
                total={data?.total || 0}
                onClickPage={setPageIndex}
              />
            </div>
            {essays?.map((essay) => (
              <EssayCard
                key={essay.id}
                essay={essay}
                onClickAuthor={setAuthor}
                onClickTag={setTag}
                onClickVideo={setVideo}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function EssayCard({
  essay,
  onClickAuthor,
  onClickTag,
  onClickVideo,
}: {
  essay: ListEssayResponseItem;
  onClickAuthor: (authorUserId: string) => void;
  onClickVideo: (videoId: string) => void;
  onClickTag: (tag: string) => void;
}) {
  return (
    <Card
      key={essay.id}
      className='@container hover:shadow-lg transition-shadow flex flex-col'
    >
      <CardHeader>
        <CardTitle className='text-xl'>{essay.title}</CardTitle>
        <div className='text-sm text-muted-foreground space-y-1'>
          <p className='line-clamp-1'>
            <EssayAuthorInfo
              className='hover:underline cursor-pointer mr-2'
              userId={essay.createdBy}
              onClick={() => {
                onClickAuthor(essay.createdBy);
              }}
            />
          </p>
          <p className='line-clamp-1'>
            <strong className='mr-2'>Video:</strong>
            <span
              className='hover:underline cursor-pointer'
              onClick={() => {
                onClickVideo(essay.videoId);
              }}
            >
              {essay.video.name}
            </span>
          </p>
          <p>
            <strong className='mr-2'>Tags:</strong>
            {(essay.video.tags || []).map((tag, tagIndex) => (
              <Fragment key={tag}>
                {tagIndex !== 0 && <span>, </span>}
                <span
                  className='py-0.5 hover:underline cursor-pointer'
                  onClick={() => onClickTag(tag)}
                >
                  {tag}
                </span>
              </Fragment>
            ))}
          </p>
        </div>
      </CardHeader>
      <CardContent className='flex-1 flex flex-col'>
        <p className='text-muted-foreground flex-1 line-clamp-3'>
          {essay.introduction}
        </p>
        <Link
          href={`/essay/${essay.id}`}
          className='mt-4 text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 self-end'
        >
          Read more
        </Link>
      </CardContent>
    </Card>
  );
}

function VideoName({ videoId }: { videoId: string }) {
  const { isPending, error, data: video } = useVideoQuery(videoId);
  return (
    <Link
      className='max-w-32 truncate hover:underline'
      href={`/video/${videoId}`}
    >
      {isPending
        ? 'loading...'
        : error
          ? error.message
          : video?.name || 'Unknown video'}
    </Link>
  );
}
