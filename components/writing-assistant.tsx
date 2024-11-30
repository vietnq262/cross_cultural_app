import { useCompletion } from 'ai/react';
import { XIcon } from 'lucide-react';

import { useVideoQuery } from '@/lib/client-api-service/videos';
import { VideoFileData } from '@/lib/types';

import { MarkDownMessageViewer } from './chat-messages';
import { Button } from './ui/button';

interface WritingAssistantProps {
  videoId?: string;
  assistantType:
    | 'essay-overall'
    | 'essay-introduction'
    | 'essay-body'
    | 'essay-conclusion';
  writingTitle: string;
  writingIntroduction: string;
  writingBody: string;
  writingConclusion: string;
}

export default function WritingAssistant(props: WritingAssistantProps) {
  return (
    <div>
      {!!props.videoId ? (
        <WritingAssistantWithVideo {...props} videoId={props.videoId} />
      ) : (
        <></>
      )}
    </div>
  );
}

function WritingAssistantWithVideo(
  props: WritingAssistantProps & {
    videoId: string;
  },
) {
  const { isPending, data: video } = useVideoQuery(props.videoId);

  if (isPending) {
    return <></>;
  }

  if (!video) {
    return <></>;
  }

  return (
    <WritingAssistantContent {...props} video={video}></WritingAssistantContent>
  );
}

function WritingAssistantContent(
  props: WritingAssistantProps & {
    video: VideoFileData;
  },
) {
  const {
    video,
    assistantType,
    writingTitle,
    writingIntroduction,
    writingBody,
    writingConclusion,
  } = props;

  const {
    isLoading,
    completion: instruction,
    setCompletion: setInstruction,
    handleSubmit: handleInstructionTopicInputSubmit,
  } = useCompletion({
    api: '/api/assistants/writing',
    initialInput: 'assistantType', // dummy value to enable the useCompletion hook submit, actuall data is the body bellow
    body: {
      type: assistantType,
      videoData: {
        name: video.name,
        description: video.description,
        transcription: video.transcribe_text,
      },
      writingData: {
        title: writingTitle,
        introduction: writingIntroduction,
        body: writingBody,
        conclusion: writingConclusion,
      },
    },
  });

  const clearInstruction = () => {
    setInstruction('');
  };

  return (
    <div className='space-y-2'>
      <div className='flex justify-end'>
        <Button
          variant='ghost'
          size='sm'
          disabled={isLoading}
          onClick={handleInstructionTopicInputSubmit}
        >
          {assistantType === 'essay-overall'
            ? 'AI Feedback'
            : 'Check the content'}
        </Button>
      </div>
      {instruction && (
        <div className='relative'>
          <div className='mt-2 text-sm text-muted-foreground max-h-96 overflow-auto rounded-md border p-4 bg-muted'>
            <MarkDownMessageViewer content={instruction} />
          </div>
          <Button
            size='sm'
            variant='destructive-outline'
            className='absolute right-4 top-4 size-8 p-2 bg-card'
            onClick={clearInstruction}
          >
            <XIcon size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
