import dynamic from 'next/dynamic';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { PlusIcon } from 'lucide-react';

import { auth, Session } from '@/auth';
import { Button } from '@/components/ui/button';

const ListEssays = dynamic(() => import('@/components/list-essays'), {
  ssr: false,
});

export default async function Home() {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    redirect(`/auth/sign-in?next=/`);
  }

  return (
    <div className='h-full overflow-auto py-8'>
      <div className='container'>
        <h1 className='mb-6 text-center text-3xl font-bold'>Essay Feed</h1>
        <div className='flex justify-end'>
          <Button size='lg'>
            <PlusIcon className='size-4 mr-2' />
            <Link href='/essay/new'>Create Essay</Link>
          </Button>
        </div>
        <ListEssays />
      </div>
    </div>
  );
}
