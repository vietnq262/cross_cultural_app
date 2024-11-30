import { auth, Session } from '@/auth';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';

const EssayDetailPage = dynamic(
  () => import('@/components/essay-detail-page'),
  {
    ssr: false,
  },
);

export default async function Page({ params }: { params: { id: string } }) {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    redirect(`/auth/sign-in?next=/essay/${params.id}`);
  }

  const essayId = params['id'];

  if (!essayId) {
    return notFound();
  }

  return <EssayDetailPage essayId={essayId} />;
}
