import { redirect } from 'next/navigation';

import { auth, Session } from '@/auth';
import LoginForm from '@/components/login-form';

export default async function LoginPage() {
  const session = (await auth()) as Session | null;

  if (session) {
    redirect('/');
  }

  return (
    <main>
      <LoginForm />
    </main>
  );
}
