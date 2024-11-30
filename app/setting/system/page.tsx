import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { auth, Session } from '@/auth';

const DocumentSetting = dynamic(() => import('@/components/document-setting'), {
  ssr: false,
});

const ResetUserPasswordSettingButton = dynamic(
  () => import('@/components/reset-user-password-button'),
  { ssr: false },
);

export default async function SystemSettingPage() {
  const session = (await auth()) as Session | null;

  if (!session?.user) {
    redirect(`/auth/sign-in?next=/setting/system`);
  }

  return (
    <div className='container space-y-4 py-4'>
      <h1 className='text-2xl font-bold'>System settings</h1>

      <section>
        <h2 className='text-lg font-bold mb-2'>Assistant RAG documents</h2>
        <DocumentSetting />
      </section>

      <section>
        <h2 className='text-lg font-bold mb-2'>Reset user password</h2>
        <ResetUserPasswordSettingButton />
      </section>
    </div>
  );
}
