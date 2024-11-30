import { forwardRef } from 'react';

import { useListVideoQuery } from '@/lib/client-api-service/videos';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SelectVideoProps {
  value: string;
  onChange: (videoId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SelectVideo = forwardRef<HTMLButtonElement, SelectVideoProps>(
  (props, ref) => {
    const { data: videos, isPending, error, refetch } = useListVideoQuery();

    if (isPending) return <p>Loading video options...</p>;
    if (error) return <p>Error loading video options: {error.message}</p>;

    return (
      <Select
        value={props.value}
        onValueChange={props.onChange}
        disabled={props.disabled}
      >
        <SelectTrigger className='w-full' ref={ref}>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {(videos || []).map((video) => (
            <SelectItem key={video.id} value={video.id}>
              {video.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
);

SelectVideo.displayName = 'SelectVideo';
