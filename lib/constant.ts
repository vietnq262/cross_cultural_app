const DEFAULT_MAX_VIDEO_SIZE_MB = 10;

export const MAX_VIDEO_SIZE_MB = process.env.NEXT_PUBLIC_APP_MAX_VIDEO_SIZE
  ? parseInt(process.env.NEXT_PUBLIC_APP_MAX_VIDEO_SIZE)
  : DEFAULT_MAX_VIDEO_SIZE_MB;

export const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_MB * 1000 * 1000;