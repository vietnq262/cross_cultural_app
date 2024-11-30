'use client';

import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useFFmpeg } from '@/lib/hooks/useFFmpeg';
import { cn, replaceFileExtension } from '@/lib/utils';

interface MediaPreprocessFormProps {
  className?: string;
  isSubmitting?: boolean;
  videoFile: File | null;
  onTranscodeComplete: (audioFile: File) => void;
  onSubmit: (audioFile: File) => void;
}

export default function MediaPreprocessForm(props: MediaPreprocessFormProps) {
  const {
    isWasmLibLoading,
    loadWasmBinary,
    isTranscoding,
    cleanUp,
    log,
    loadError,
    transcodeVideoToAudio,
  } = useFFmpeg();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const thumbnailRef = useRef<HTMLImageElement | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  // const [thumbnailFile, setthumbnailFile] = useState<File | null>(null);

  const onClickSubmit = () => {
    if (!audioFile) {
      toast.error('Audio processing is not ready');
      return;
    }
    props.onSubmit(audioFile);
  };

  const reset = () => {
    if (videoRef.current) {
      videoRef.current.src = '';
    }
    if (audioRef.current) {
      audioRef.current.src = '';
    }
    if (thumbnailRef.current) {
      thumbnailRef.current.src = '';
    }
    // setthumbnailFile(null);
    setAudioFile(null);
    cleanUp();
  };

  const processFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    // show video element to previd
    if (videoRef.current) {
      const videoUrl = URL.createObjectURL(file);
      videoRef.current.src = videoUrl;
      videoRef.current.load();
    }

    try {
      const {
        // thumbnail: thumbnailFileData,
        audio: audioFileData,
      } = await transcodeVideoToAudio(file);

      // if (!!thumbnailFileData && !!thumbnailRef.current) {
      //   const newthumbnailFileName = replaceFileExtension(file.name, 'jpg');
      //   const newthumbnailFile = new File(
      //     [thumbnailFileData.buffer],
      //     newthumbnailFileName,
      //     {
      //       type: 'image/jpg',
      //     },
      //   );
      //   setthumbnailFile(newthumbnailFile);
      //   const thumbnailUrl = URL.createObjectURL(newthumbnailFile);
      //   thumbnailRef.current.src = thumbnailUrl;
      // }

      if (!!audioFileData && !!audioRef.current) {
        const newAudioFileName = replaceFileExtension(file.name, 'mpeg');
        const newAudioFile = new File(
          [audioFileData.buffer],
          newAudioFileName,
          {
            type: 'audio/mpeg',
          },
        );
        setAudioFile(newAudioFile);
        const audioUrl = URL.createObjectURL(newAudioFile);
        audioRef.current.src = audioUrl;

        props.onTranscodeComplete(newAudioFile);
      }
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to process file', {
        description: e.message || JSON.stringify(e),
      });
    } finally {
    }
  };

  useEffect(() => {
    cleanUp();
    processFile(props.videoFile);
  }, [props.videoFile]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <div className={cn('flex flex-col gap-4', props.className)}>
      <div>
        <p className='mb-1'>Preview video:</p>
        <video
          className='rounded-md w-full max-h-96 border bg-muted'
          ref={videoRef}
          controls
        />
      </div>

      <div>
        <p className='mb-1'>Preview audio</p>
        <audio className='w-full' ref={audioRef} controls />
      </div>

      {/* <div>
        <p className='mb-1'>Preview thumbnail</p>
        <img
          className='rounded-md w-full max-h-96 border bg-muted'
          ref={thumbnailRef}
        />
      </div> */}

      {(isWasmLibLoading || isTranscoding) && (
        <div className='bg-muted text-muted-foreground text-sm font-mono p-4 max-h-[200px] overflow-y-auto whitespace-pre-wrap'>
          <p>{log}</p>
        </div>
      )}

      {!!loadError && <p className='text-destructive'>{loadError}</p>}

      <Button
        disabled={!audioFile || isTranscoding || props.isSubmitting}
        onClick={onClickSubmit}
      >
        {isTranscoding
          ? 'Processing video...'
          : props.isSubmitting
            ? 'Submitting...'
            : 'Submit'}
      </Button>
    </div>
  );
}
