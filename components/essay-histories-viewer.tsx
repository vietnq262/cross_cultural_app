import { useState } from 'react';

import {
  EssayHistoryVersion,
  GetEssayHistoriesResponse,
} from '@/app/api/essays/[essay-id]/histories/route';
import { useEssayHistoriesQuery } from '@/lib/client-api-service/essay-histories';
import { Essay } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

import EssayViewer from './essay-viewer';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ViewEssayDiffButton } from './view-essay-diff-button';

export function EssayHistoriesViewer({
  className,
  essay,
}: {
  className?: string;
  essay: Essay;
}) {
  const { data, isLoading } = useEssayHistoriesQuery(essay.id);

  const [selectedVersion, setSelectedVersion] = useState<Essay | null>(null);

  if (isLoading) {
    return <div className='p-4 text-center animate-pulse'>Loading...</div>;
  }

  if (!data?.histories) {
    return <div className='p-4 text-center'>No history found</div>;
  }

  const versions = [
    essay,
    ...data.histories
      .map((history) => mapHistoyToEssay(history))
      .sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      ),
  ];

  const selectedVersionIndex = versions?.findIndex(
    (version) => version.id === selectedVersion?.id,
  );

  const isSelectedVersionCurrent = selectedVersionIndex === 0;

  const olderVersion =
    selectedVersionIndex <= versions.length - 1
      ? versions[selectedVersionIndex + 1]
      : null;

  const newerVersion =
    selectedVersionIndex >= 1 ? versions[selectedVersionIndex - 1] : null;

  return (
    <div className={cn('flex flex-row items-stretch gap-4', className)}>
      <ScrollArea className='w-64 p-4 bg-card border'>
        <ul className='space-y-2'>
          {versions.map((version, index) => (
            <li key={version.id}>
              <Button
                className={cn('w-full', {
                  'bg-primary text-primary-foreground':
                    index === selectedVersionIndex,
                })}
                variant='outline'
                size='sm'
                onClick={() => setSelectedVersion(version)}
              >
                {index === 0
                  ? 'Current version'
                  : new Date(version.updatedAt).toLocaleString()}
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className='flex-1 min-w-0'>
        {selectedVersion ? (
          <div className='size-full flex flex-col gap-4'>
            <div className='flex gap-2 justify-between px-4'>
              {!!olderVersion && (
                <ViewEssayDiffButton
                  size='sm'
                  essayLeft={olderVersion}
                  essayLeftLabel='Older version'
                  essayRight={selectedVersion}
                  essayRightLabel='Selected version'
                >
                  Compare with older version
                </ViewEssayDiffButton>
              )}
              {!isSelectedVersionCurrent && (
                <ViewEssayDiffButton
                  size='sm'
                  essayLeft={selectedVersion}
                  essayLeftLabel='Selected version'
                  essayRight={essay}
                  essayRightLabel='Current version'
                >
                  Compare with current version
                </ViewEssayDiffButton>
              )}
              {!!newerVersion && (
                <ViewEssayDiffButton
                  size='sm'
                  essayLeft={selectedVersion}
                  essayLeftLabel='Selected version'
                  essayRight={newerVersion}
                  essayRightLabel='Newer version'
                >
                  Compare with newer version
                </ViewEssayDiffButton>
              )}
            </div>
            <ScrollArea className='min-h-0 flex-1 p-4'>
              <EssayViewer essay={selectedVersion} hideAuthor />
            </ScrollArea>
          </div>
        ) : (
          <div className='size-full p-4'>Click a version to view</div>
        )}
      </div>
    </div>
  );
}

function mapHistoyToEssay(history: EssayHistoryVersion): Essay {
  return {
    id: history.id,
    createdAt: history.createdAt,
    updatedAt: history.createdAt,
    title: history.title,
    introduction: history.introduction,
    body: history.body,
    conclusion: history.conclusion,
  } as Essay;
}
