import { useParams, useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Essay } from '@/lib/types';

import CreateEssayForm from './create-essay-form';

export default function CreateEssayPage() {
  const router = useRouter();

  const params = useParams();

  const initialVideoId = params['video-id'] as string;

  const onCreated = (essay: Essay) => {
    toast.success('Essay created successfully!');
    router.push(`/essay/${essay.id}`);
  };

  return (
    <div className='container py-8'>
      <CreateEssayForm initialVideoId={initialVideoId} onCreated={onCreated} />
    </div>
  );
}
