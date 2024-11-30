import { useConfirmDialog } from '@/components/global-dialogs';
import { Button, ButtonProps } from '@/components/ui/button';
import { useDeleteEssayMutation } from '@/lib/client-api-service/essay';
import { Essay } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DeleteEssayButtonProps extends Omit<ButtonProps, 'onClick'> {
  essay: Essay;
  onDeleted?: () => void;
}

export function DeleteEssayButton(props: DeleteEssayButtonProps) {
  const { className, essay, onDeleted, ...otherProps } = props;

  const confirm = useConfirmDialog();

  const { mutate: deleteEssay } = useDeleteEssayMutation(essay.id, onDeleted);

  const onClickDelete = async () => {
    const confirmDeletion = await confirm({
      title: `Delete "${essay.title}"?`,
      body: 'This action is irreversible.',
    });
    if (confirmDeletion) {
      deleteEssay();
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
