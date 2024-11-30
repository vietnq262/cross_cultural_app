import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  CreateVideoRequest,
  ListVideoResponse,
  UpdateVideoRequest,
  VideoFileData,
} from '@/lib/types';

import { supabaseClient } from '../supabase/client';

async function getListVideos(): Promise<ListVideoResponse> {
  const query = new URLSearchParams();
  const response = await fetch(`/api/videos?${query.toString()}`);
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return (await response.json()) as ListVideoResponse;
}

const uploadFileToSupabase = async (
  bucket: string,
  path: string,
  file: File,
) => {
  return supabaseClient.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
};

const deldeteFileFromSupabase = async (bucket: string, path: string) => {
  return supabaseClient.storage.from(bucket).remove([path]);
};

const uploadVideoAndAudioToSupabase = async (
  uploadPath: string,
  videoFile: File,
  audioFile: File,
): Promise<{
  videoId: string;
  videoFilePath: string;
  videoFileFullPath: string;
  audioFilePath: string;
  audioFileFullPath: string;
}> => {
  const uploadBucket = 'documents';

  const videoFileName = videoFile.name;
  const uploadVideoPath = `${uploadPath}/${videoFileName}`;

  const audioFileName = audioFile.name;
  const uploadAudioPath = `${uploadPath}/${audioFileName}`;

  const { data: uploadedVideoData, error: uploadVideoError } =
    await uploadFileToSupabase(uploadBucket, uploadVideoPath, videoFile);
  if (uploadVideoError) {
    throw uploadVideoError;
  }

  const { data: uploadedAudioData, error: uploadAudioError } =
    await uploadFileToSupabase(uploadBucket, uploadAudioPath, audioFile);
  if (uploadAudioError) {
    // delete video file if audio file upload failed
    const { error: cleanUpFailedUploadError } = await deldeteFileFromSupabase(
      uploadBucket,
      uploadVideoPath,
    );

    if (cleanUpFailedUploadError) {
      toast.error(
        'Failed to cleanup temporary uploaded file! Please report to administrator for furthur action!',
        {
          description: cleanUpFailedUploadError.message,
          duration: 100000,
        },
      );
    }

    throw uploadAudioError;
  }

  return {
    videoId: uploadedVideoData.id,
    videoFilePath: uploadedVideoData.path,
    videoFileFullPath: uploadedVideoData.fullPath,
    audioFilePath: uploadedAudioData.path,
    audioFileFullPath: uploadedAudioData.fullPath,
  };
};

async function uploadVideo(
  uploadPath: string,
  videoFile: File,
  audioFile: File,
): Promise<VideoFileData> {
  const data = await uploadVideoAndAudioToSupabase(
    uploadPath,
    videoFile,
    audioFile,
  );

  const {
    videoId,
    videoFilePath,
    videoFileFullPath,
    audioFilePath,
    audioFileFullPath,
  } = data;

  const request: CreateVideoRequest = {
    id: videoId,
    name: videoFile.name,
    file_type: videoFile.type,
    file_size: videoFile.size,
    file_last_modified: new Date().getTime(),
    path: videoFilePath,
    full_path: videoFileFullPath,
    audio_file_path: audioFilePath,
    audio_file_full_path: audioFileFullPath,
    description: '',
    tags: [],
  };

  const response = await fetch(`/api/videos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return (await response.json()) as VideoFileData;
}

async function getVideo(videoId: string): Promise<VideoFileData | null> {
  const response = await fetch(`/api/videos/${videoId}`);
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }
  return (await response.json()) as VideoFileData;
}

async function updateVideo(videoId: string, data: UpdateVideoRequest) {
  const response = await fetch(`/api/videos/${videoId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }
  return;
}

async function deleteVideo(videoId: string) {
  const response = await fetch(`/api/videos/${videoId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return;
}

export const useListVideoQuery = () =>
  useQuery({
    queryKey: ['videos'],
    queryFn: () => getListVideos(),
    placeholderData: keepPreviousData,
  });

export const useVideoQuery = (videoId: string) =>
  useQuery({
    queryKey: ['videos', videoId],
    queryFn: () => getVideo(videoId),
  });

export const useUploadVideoMutation = (
  onSuccess?: (video: VideoFileData) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['videos'],
    mutationFn: (data: {
      uploadPath: string;
      videoFile: File;
      audioFile: File;
    }) => uploadVideo(data.uploadPath, data.videoFile, data.audioFile),
    onSuccess: (data: VideoFileData) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateVideoMutation = (
  videoId: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['videos', videoId],
    mutationFn: (data: UpdateVideoRequest) => updateVideo(videoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos', videoId] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteVideoMutation = (
  videoId: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['videos', videoId],
    mutationFn: () => deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos', videoId] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
