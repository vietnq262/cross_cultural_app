import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Feedback } from 'langsmith';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { SpinnerIcon, ThumbsUpIcon } from './ui/icons';
import { Textarea } from './ui/textarea';

const scoreValues = [0, 0.25, 0.5, 0.75, 1];
const scoreFaces = ['😞', '🙁', '😐', '🙂', '😀'];

const formSchema = z.object({
  score: z.number(),
  comment: z
    .string()
    .trim()
    .max(1000)
    .nullish()
    .superRefine((v) => v ?? ''),
});

type FormValue = z.infer<typeof formSchema>;

const createFeedback = async (data: {
  runId: string;
  score: number;
  comment?: string;
}): Promise<Feedback> => {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({
      run_id: data.runId,
      score: data.score,
      comment: data.comment,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed create feedback');
  }

  const json = await response.json();
  return json.feedback as Feedback;
};

interface MessageFeedbackDialogProps {
  className?: string;
  runId: string;
  // feedbackId?: string;
  open?: boolean;
  onClose?: (feedbackId?: string) => void;
}

const MessageFeedbackDialog = (props: MessageFeedbackDialogProps) => {
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    // defaultValues: props.feedbackId
    //   ? async () =>
    //       getFeedback(props.feedbackId!).then(
    //         (fb) =>
    //           ({
    //             score: fb?.score,
    //             comment: fb?.comment,
    //           }) as FormValue,
    //       )
    //   : undefined,
  });

  async function submitFeedback(formValue: FormValue) {
    const { score, comment } = formValue;

    try {
      // if (props.feedbackId) {
      //   await updateFeedback(props.feedbackId, {
      //     score: score,
      //     comment: comment ?? undefined,
      //   });
      //   toast('Feedback updated!');
      //   props.onClose?.(props.feedbackId);
      // } else {
      const newFeedback = await createFeedback({
        runId: props.runId,
        score: score,
        comment: comment || undefined,
      });
      toast('Feedback recorded!');
      props.onClose?.(newFeedback.id);
      // }
    } catch (e) {
      toast.error('Error occurred when sending feedback!');
    }
  }

  return (
    <div className={cn('flex gap-0.5', props.className)}>
      <Dialog
        open={props.open}
        onOpenChange={(isOpening) => {
          if (!isOpening) {
            form.reset();
            props.onClose?.();
          }
        }}
      >
        <Form {...form}>
          <DialogContent>
            <form onSubmit={form.handleSubmit(submitFeedback)}>
              <fieldset
                className='space-y-4'
                disabled={form.formState.isSubmitting}
              >
                <DialogHeader>
                  <DialogTitle>Feedback</DialogTitle>
                </DialogHeader>

                <FormField<FormValue, 'score'>
                  control={form.control}
                  name='score'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Score<span className='align-super text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <div className='flex justify-center gap-4'>
                          {scoreValues.map((n, index) => (
                            <Button
                              key={index}
                              className={cn(
                                'size-10 rounded-lg border border-transparent text-2xl',
                                n === field.value ? 'border-primary' : '',
                              )}
                              variant='ghost'
                              type='button'
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(n);
                              }}
                            >
                              {scoreFaces[index]}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<FormValue, 'comment'>
                  control={form.control}
                  name='comment'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Anything else you'd like to add about this response?`}
                          rows={5}
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type='submit'>
                    {form.formState.isSubmitting && (
                      <SpinnerIcon className='mr-2 animate-spin' />
                    )}
                    {/* {props.feedbackId ? 'Update' : 'Submit'} */}
                    Submit
                  </Button>
                </DialogFooter>
              </fieldset>
            </form>
          </DialogContent>
        </Form>
      </Dialog>
    </div>
  );
};

interface MessageFeedbackProps {
  className?: string;
  runId: string;
  feedbackId?: string;
  onFeedbackAdded?: (feedbackId: string) => void;
}

const MessageFeedback = (props: MessageFeedbackProps) => {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState<boolean>(false);

  return (
    <div className={cn('flex gap-0.5', props.className)}>
      <Button
        className={cn(
          'size-6 p-1',
          !!props.feedbackId && 'bg-primary text-primary-foreground',
        )}
        variant='outline'
        size='icon'
        onClick={(e) => {
          setShowFeedbackDialog(true);
        }}
      >
        <ThumbsUpIcon />
      </Button>

      <MessageFeedbackDialog
        // feedbackId={props.feedbackId}
        runId={props.runId}
        open={showFeedbackDialog}
        onClose={(feedbackId) => {
          setShowFeedbackDialog(false);
          if (feedbackId) {
            props.onFeedbackAdded?.(feedbackId);
          }
        }}
      />
    </div>
  );
};

export default MessageFeedback;
