import { useConfirmDialog } from '@/components/global-dialogs';
import { Button, ButtonProps } from '@/components/ui/button';
import { useDeleteVideoMutation } from '@/lib/client-api-service/videos';
import { VideoFileData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DeleteVideoButtonProps extends Omit<ButtonProps, 'onClick'> {
  video: VideoFileData;
  onDeleted?: () => void;
}

export function DeleteVideoButton(props: DeleteVideoButtonProps) {
  const { className, video, onDeleted, ...otherProps } = props;

  const confirm = useConfirmDialog();

  const { mutate: deleteVideo } = useDeleteVideoMutation(video.id, onDeleted);

  const onClickDelete = async () => {
    const confirmDeletion = await confirm({
      title: `Delete "${video.name}"?`,
      body: 'This action is irreversible.\nThe essays written for this video will remain but the referenced video can not be viewed again.',
    });
    if (confirmDeletion) {
      deleteVideo();
    }
  };

  return (
    <Button
      className={cn('', className)}
      variant='destructive-outline'
      type='button'
      {...otherProps}
      onClick={onClickDelete}
    />
  );
}
