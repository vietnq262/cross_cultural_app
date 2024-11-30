import { useForm } from 'react-hook-form';

import { useUpdateVideoMutation } from '@/lib/client-api-service/videos';
import { VideoFileData } from '@/lib/types';

import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { SelectTagInput } from './ui/input-tags';
import { Textarea } from './ui/textarea';

interface UpdateVideoFormProps {
  initialVideo: VideoFileData;
  onUpdated?: () => void;
}

export default function UpdateVideoForm({
  initialVideo,
  onUpdated,
}: UpdateVideoFormProps) {
  const { isPending, mutate: updateVideo } = useUpdateVideoMutation(
    initialVideo.id,
    onUpdated,
  );

  const form = useForm({
    defaultValues: {
      name: initialVideo.name,
      description: initialVideo.description,
      tags: initialVideo.tags || '',
      transcribe_text: initialVideo.transcribe_text,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data, event) => updateVideo(data))}
        className='space-y-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter video name' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Enter a description of the video'
                  className='min-h-[100px]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Tags</FormLabel>
              <FormControl>
                <SelectTagInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='transcribe_text'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Transcription</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  {...field}
                  placeholder='Enter the video transcription here'
                  className='min-h-[100px]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Updating...' : 'Update Video'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
