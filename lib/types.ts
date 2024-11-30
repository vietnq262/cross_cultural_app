import { Document } from '@langchain/core/documents';
import { CoreMessage } from 'ai';
import { z } from 'zod';

export type AssistantMessageSourceDocument = {
  documentId: string;
  documentName: string;
  pageContent: string;
  loc: {
    lines: {
      to: number;
      from: number;
    };
    pageNumber: number;
  };
};

export type MessageToolCall = {
  id: string;
  name: string;
  input: any;
  output: any;
};

export type Message = CoreMessage & {
  id: string;
  runId?: string;
  feedbackId?: string;
  sources?: AssistantMessageSourceDocument[];
  tools?: MessageToolCall[];
};

export interface ChatDocument {
  id: string;
  user_id: string;
  payload: Chat;
}

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export type DocumentFileData = {
  id: string;
  name: string;
  path: string;
  full_path: string;
  file_type: string;
  file_size: number;
  file_last_modified: number;

  deleted_at?: string;
};

export type DocumentChunkMetadata = Record<string, any> & {
  loc: {
    lines: {
      to: number;
      from: number;
    };
    pageNumber: number;
  };
  source: string;
  documentId: string;
};

export type RetrievableDocumentChunk = Document<DocumentChunkMetadata>;

export type VideoFileData = DocumentFileData & {
  created_by: string;
  created_at: string;
  audio_file_path: string;
  audio_file_full_path: string;
  original_transcribe_text: string;
  transcribe_text: string;
  description: string;
  tags: string[];
};

export type ListVideoResponse = VideoFileData[];
export type CreateVideoRequest = Omit<
  VideoFileData,
  'created_by' | 'created_at' | 'deleted_at' | 'original_transcribe_text' | 'transcribe_text'
>;
export type GetVideoDetailResponse = VideoFileData;
export type UpdateVideoRequest = Pick<
  VideoFileData,
  'name' | 'description' | 'tags' | 'transcribe_text'
>;

export type ServerActionResult<Result> = Promise<
  | Result
  | {
    error: string;
  }
>;

export enum AuthResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN',
}

export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case AuthResultCode.InvalidCredentials:
      return 'Invalid credentials!';
    case AuthResultCode.InvalidSubmission:
      return 'Invalid submission, please try again!';
    case AuthResultCode.UserAlreadyExists:
      return 'User already exists, please log in!';
    case AuthResultCode.UserCreated:
      return 'User created, welcome!';
    case AuthResultCode.UnknownError:
      return 'Something went wrong, please try again!';
    case AuthResultCode.UserLoggedIn:
      return 'Logged in!';
  }
};

export interface AuthResult {
  type: 'success' | 'error';
  resultCode: AuthResultCode;
  message?: string;
}

export const SignUpDataSchema = z.object({
  name: z.string().trim().min(6).max(100),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(6)
    .max(20)
    .regex(
      /^[a-zA-Z0-9]+$/,
      'Username can only contain alphanumeric characters',
    )
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6),
});

export type Essay = {
  id: string;
  videoId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy: string;

  title: string;
  introduction: string;
  body: string;
  conclusion: string;
};

export type GetEssayDetailResponse = Essay;

export type UpdateEssayRequest = Pick<
  Essay,
  'title' | 'introduction' | 'body' | 'conclusion'
>;
export type ListEssayResponseItem = Essay & {
  video: Pick<VideoFileData, 'id' | 'name' | 'tags'>;
};
export type ListEssayResponse = {
  items: ListEssayResponseItem[];
  total: number;
};

export type CreateEssayRequest = Pick<
  Essay,
  'videoId' | 'title' | 'introduction' | 'body' | 'conclusion'
>;

export type CreateEssayResponse = Essay;

export type ListEssayParams = {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  videoId?: string;
  videoTag?: string;
  authorId?: string;
};

export const LIST_ESSAY_DEFAULT_PAGE_SIZE = 12;

export const EssayDetailFormSchema = z.object({
  videoId: z.string().min(1),
  title: z.string().min(1),
  introduction: z.string().min(100),
  body: z.string().min(100),
  conclusion: z.string().min(100),
});

export type EssayDetailFormValue = z.infer<typeof EssayDetailFormSchema>;

export const EssayFeedbackFormSchema = z.object({
  feedback: z.string().min(100),
});
