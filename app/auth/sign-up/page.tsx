import { redirect } from 'next/navigation';

import { auth, Session } from '@/auth';
import SignupForm from '@/components/signup-form';

export default async function SignupPage() {
  const session = (await auth()) as Session | null;

  if (session) {
    redirect('/');
  }

  return (
    <main>
      <SignupForm />
    </main>
  );
}
