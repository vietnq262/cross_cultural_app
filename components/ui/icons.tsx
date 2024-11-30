'use client';

import * as React from 'react';

import Image, { ImageProps } from 'next/image';

import {
  BugIcon,
  CircleAlertIcon,
  InfoIcon,
  SettingsIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

function AppIcon({ className, ...props }: Omit<ImageProps, 'src' | 'alt'>) {
  return <Image src='/images/logo.jpg' alt='logo' {...props} height={32} width={32} />;
}

function AIIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill='currentColor'
      viewBox='0 0 24 24'
      role='img'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('size-4', className)}
      {...props}
    >
      <title>AI icon</title>

      <path d='M12 8V4H8' />
      <rect width='16' height='12' x='4' y='8' rx='2' />
      <path d='M2 14h2' />
      <path d='M20 14h2' />
      <path d='M15 13v2' />
      <path d='M9 13v2' />
    </svg>
  );
}

function GitHubIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      role='img'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <title>GitHub</title>
      <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
    </svg>
  );
}

function ArrowDownIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='m205.66 149.66-72 72a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l58.34-58.35a8 8 0 0 1 11.32 11.32Z' />
    </svg>
  );
}

function UserIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z' />
    </svg>
  );
}

function PlusIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8Z' />
    </svg>
  );
}

function ArrowElbowIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z' />
    </svg>
  );
}

function SpinnerIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4 animate-spin', className)}
      {...props}
    >
      <path d='M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128Z' />
    </svg>
  );
}

function MessageIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M216 48H40a16 16 0 0 0-16 16v160a15.84 15.84 0 0 0 9.25 14.5A16.05 16.05 0 0 0 40 240a15.89 15.89 0 0 0 10.25-3.78.69.69 0 0 0 .13-.11L82.5 208H216a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16ZM40 224Zm176-32H82.5a16 16 0 0 0-10.3 3.75l-.12.11L40 224V64h176Z' />
    </svg>
  );
}

function SidebarIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM40 56h40v144H40Zm176 144H96V56h120v144Z' />
    </svg>
  );
}

function MoonIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M233.54 142.23a8 8 0 0 0-8-2 88.08 88.08 0 0 1-109.8-109.8 8 8 0 0 0-10-10 104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88 104.84 104.84 0 0 0 37-52.91 8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104 106 106 0 0 0 14.92-1.06 89 89 0 0 1-26.02 31.4Z' />
    </svg>
  );
}

function SunIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0Zm72 88a64 64 0 1 1-64-64 64.07 64.07 0 0 1 64 64Zm-16 0a48 48 0 1 0-48 48 48.05 48.05 0 0 0 48-48ZM58.34 69.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32ZM192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72Zm5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM48 128a8 8 0 0 0-8-8H16a8 8 0 0 0 0 16h24a8 8 0 0 0 8-8Zm80 80a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8Zm112-88h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16Z' />
    </svg>
  );
}

function CopyIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8Zm-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z' />
    </svg>
  );
}

function CheckIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z' />
    </svg>
  );
}

function DownloadIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('size-4', className)}
      {...props}
    >
      <path d='M224 152v56a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-56a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0Zm-101.66 5.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 132.69V40a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z' />
    </svg>
  );
}

function ShareIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className={cn('size-4', className)}
      viewBox='0 0 256 256'
      {...props}
    >
      <path d='m237.66 106.35-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z' />
    </svg>
  );
}

function UsersIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className={cn('size-4', className)}
      viewBox='0 0 256 256'
      {...props}
    >
      <path d='M117.25 157.92a60 60 0 1 0-66.5 0 95.83 95.83 0 0 0-47.22 37.71 8 8 0 1 0 13.4 8.74 80 80 0 0 1 134.14 0 8 8 0 0 0 13.4-8.74 95.83 95.83 0 0 0-47.22-37.71ZM40 108a44 44 0 1 1 44 44 44.05 44.05 0 0 1-44-44Zm210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16 44 44 0 1 0-16.34-84.87 8 8 0 1 1-5.94-14.85 60 60 0 0 1 55.53 105.64 95.83 95.83 0 0 1 47.22 37.71 8 8 0 0 1-2.33 11.07Z' />
    </svg>
  );
}

export {
  AppIcon,
  AIIcon,
  GitHubIcon,
  ArrowDownIcon,
  UserIcon,
  PlusIcon,
  ArrowElbowIcon,
  SpinnerIcon,
  MessageIcon,
  SidebarIcon,
  MoonIcon,
  SunIcon,
  CopyIcon,
  CheckIcon,
  DownloadIcon,
  ShareIcon,
  UsersIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CircleAlertIcon as WarningIcon,
  BugIcon as DebugIcon,
  InfoIcon,
  SettingsIcon,
};
