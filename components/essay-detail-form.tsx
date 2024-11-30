'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { EssayDetailFormSchema, EssayDetailFormValue } from '@/lib/types';

import EssayPreview from './essay-preview';
import { SelectVideo } from './select-video';
import { Button } from './ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Textarea } from './ui/textarea';
import VideoDetail from './video-detail';
import WritingAssistant from './writing-assistant';

interface EssayDetailFormProps {
  initialValue: EssayDetailFormValue;
  onSubmit: (value: EssayDetailFormValue) => Promise<void>;
  disableVideoSelect?: boolean;
  isPending?: boolean;
}

export default function EssayDetailForm({
  initialValue,
  onSubmit,
  disableVideoSelect,
  isPending,
}: EssayDetailFormProps) {
  const form = useForm<EssayDetailFormValue>({
    resolver: zodResolver(EssayDetailFormSchema),
    defaultValues: initialValue,
  });
  const selectedVideoId = form.watch('videoId');
  const title = form.watch('title');
  const introduction = form.watch('introduction');
  const body = form.watch('body');
  const conclusion = form.watch('conclusion');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex gap-4 flex-col md:flex-row'>
          <div className='flex-1 space-y-4'>
            <FormField
              control={form.control}
              name='videoId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video selection</FormLabel>
                  <FormControl>
                    <SelectVideo
                      placeholder='Select a video to start writing...'
                      disabled={disableVideoSelect}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {!!field.value && (
                    <Collapsible className='mt-2'>
                      <div className='flex justify-end'>
                        <CollapsibleTrigger asChild>
                          <Button variant='ghost' size='sm' type='button'>
                            Toggle video detail
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className='border rounded-md mt-2'>
                        <VideoDetail videoId={field.value} />
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write a short title here...'
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='introduction'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Introduction</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write your essay introduction here...'
                      rows={10}
                      disabled={!selectedVideoId}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <WritingAssistant
                    videoId={selectedVideoId}
                    assistantType='essay-introduction'
                    writingTitle={title}
                    writingIntroduction={introduction}
                    writingBody={body}
                    writingConclusion={conclusion}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='body'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write your essay body here...'
                      rows={10}
                      disabled={!selectedVideoId}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <WritingAssistant
                    videoId={selectedVideoId}
                    assistantType='essay-body'
                    writingTitle={title}
                    writingIntroduction={introduction}
                    writingBody={body}
                    writingConclusion={conclusion}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='conclusion'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conclusion</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write your essay conclusion here...'
                      rows={10}
                      disabled={!selectedVideoId}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <WritingAssistant
                    videoId={selectedVideoId}
                    assistantType='essay-conclusion'
                    writingTitle={title}
                    writingIntroduction={introduction}
                    writingBody={body}
                    writingConclusion={conclusion}
                  />
                </FormItem>
              )}
            />
          </div>
          {/* <Separator className='h-full w-1' orientation='vertical' /> */}
          <div className='flex-1 space-y-4'>
            <p>Essay preview</p>
            <div className='border p-4 rounded-md'>
              <EssayPreview
                title={title}
                introduction={introduction}
                body={body}
                conclusion={conclusion}
              />
            </div>
            <div className='flex justify-end gap-2'>
              <WritingAssistant
                videoId={selectedVideoId}
                assistantType='essay-overall'
                writingTitle={title}
                writingIntroduction={introduction}
                writingBody={body}
                writingConclusion={conclusion}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-center'>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
