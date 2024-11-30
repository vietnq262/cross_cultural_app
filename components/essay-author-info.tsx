import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { useQuery } from '@tanstack/react-query';

import { GetUserResponse } from '@/app/api/users/[user-id]/route';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton, SkeletonText } from './ui/skeleton';

const fetchUser = async (userId: string): Promise<GetUserResponse> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

interface EssayAuthorInfoProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
    'children'
  > {
  userId: string;
}

export default function EssayAuthorInfo({
  userId,
  className,
  ...otherProps
}: EssayAuthorInfoProps) {
  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const avatar = isPending ? (
    <SkeletonText className='size-6 rounded-full' />
  ) : (
    <Avatar className='size-6'>
      <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
      <AvatarFallback>
        {user?.name
          ?.split(' ')
          .map((n) => n[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
  );

  const username = isPending ? (
    <SkeletonText className='w-24 h-4' />
  ) : (
    <span>{user?.name}</span>
  );

  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      {...otherProps}
    >
      {avatar}
      {username}
    </span>
  );
}
