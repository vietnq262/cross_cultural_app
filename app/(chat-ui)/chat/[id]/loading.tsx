import { SpinnerIcon } from '@/components/ui/icons';

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatLoadingPage({ params }: ChatPageProps) {
  return (
    <div className='size-full flex items-center justify-center'>
      <SpinnerIcon className='size-10 animate-spin' />
    </div>
  );
}
