'use client';

import { useState } from 'react';

import { TrashIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadVideoMutation } from '@/lib/client-api-service/videos';
import { MAX_VIDEO_SIZE, MAX_VIDEO_SIZE_MB } from '@/lib/constant';
import { VideoFileData } from '@/lib/types';
import { cn } from '@/lib/utils';

import MediaPreprocessForm from './media-preprocess-form';
import UploadVideoInstruction from './upload-video-instruction';

interface UploadVideoFormProps {
  className?: string;
  uploadPath: string;
  onDone?: (video: VideoFileData) => void;
  onCancel?: () => void;
}

export default function UploadVideoForm(props: UploadVideoFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const {
    mutate: uploadVideo,
    isPending,
    error,
    data,
  } = useUploadVideoMutation((video) => props.onDone?.(video));

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const checkFileAndStartPreprocess = async (file: File) => {
    if (file.size > MAX_VIDEO_SIZE) {
      toast.info(
        `Selected file too big, currently support maximum ${MAX_VIDEO_SIZE_MB}MB.`,
      );
      return;
    }

    setVideoFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;

    if (files.length !== 1) {
      toast.error('Please drop only 1 video file');
    }

    const file = files[0];
    checkFileAndStartPreprocess(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files?.length) {
      toast.info('Please select a file');
      return;
    }

    if (files.length > 1) {
      toast.info(
        'You selected more than 1 file, only the first file is being processed.',
      );
      return;
    }

    const file = files[0];
    checkFileAndStartPreprocess(file);
  };

  return (
    <div className={cn('space-y-6', props.className)}>
      {error && <div className='text-red-500'>{error.message}</div>}
      {data && <div className='text-green-500'>{JSON.stringify(data)}</div>}

      <UploadVideoInstruction />

      <Input
        id='video-upload'
        type='file'
        accept='video/*'
        className='hidden'
        onChange={handleFileChange}
      />

      {videoFile ? (
        <div>
          <div className='flex flex-row w-full gap-4 items-center rounded-md border py-2 pr-2 pl-4'>
            <p className='flex-1 min-w-0 text-sm'>
              <span>File selected: </span>
              <strong className='font-mono'>{videoFile?.name}</strong>
            </p>
            <Button
              variant='destructive'
              size='icon'
              disabled={isPending}
              onClick={() => {
                setVideoFile(null);
                setAudioFile(null);
              }}
            >
              <TrashIcon />
              <span className='sr-only'>Clear file</span>
            </Button>
          </div>
          <MediaPreprocessForm
            className='w-full mt-4'
            videoFile={videoFile}
            onTranscodeComplete={(audioFile) => {
              setAudioFile(audioFile);
            }}
            isSubmitting={isPending}
            onSubmit={(audioFile) => {
              if (!audioFile) {
                toast.error('Missing audio file');
                return;
              }
              if (!videoFile) {
                toast.error('Missing video file');
                return;
              }
              uploadVideo({
                uploadPath: props.uploadPath,
                videoFile,
                audioFile,
              });
            }}
          />
        </div>
      ) : (
        <div
          className={cn(
            'rounded-lg border-2 border-dashed p-4 text-center text-muted-foreground',
            isDragging ? 'border-primary' : 'border-muted-foreground',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Label htmlFor='video-upload' className='cursor-pointer'>
            <Upload className='mx-auto' />
            <span className='mt-2 block text-sm'>
              Drag and drop your video here, or click to select
            </span>
          </Label>
        </div>
      )}
    </div>
  );
}
