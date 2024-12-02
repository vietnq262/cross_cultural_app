import Link from 'next/link';

import LoginSocialButton from '@/components/login-social-button';
import LoginWithCredentialForm from '@/components/login-with-credential-form';

export default function LoginForm() {
  return (
    <div className='flex flex-col items-center gap-4 space-y-3'>
      <div className='w-full flex-1 rounded-lg border bg-card p-4 shadow-md md:w-96'>
        <p className='my-6 text-lg font-bold text-center w-full'>
          <span>Welcome to</span>
          <br />
          <strong className='text-primary'>SmartCrossCulturalLearning</strong>
        </p>
        <img src='/images/logo.jpg' alt='' className='size-32 mx-auto' />

        <h1 className='my-6 text-2xl font-bold text-center w-full'>
          Please log in to continue
        </h1>

        <LoginWithCredentialForm />

        <div className='py-4 text-center text-sm text-muted-foreground'>or</div>

        <div className='space-y-2'>
          <LoginSocialButton className='w-full' providerId='google'>
            <img
              src='https://developers.google.com/identity/images/g-logo.png'
              alt='Google logo'
              className='inline mr-2'
              style={{ height: '20px', width: '20px' }}
            />
            Login with Google account
          </LoginSocialButton>
        </div>
      </div>

      <Link
        href='/auth/sign-up'
        className='flex flex-row gap-1 text-sm text-muted-foreground'
      >
        No account yet?{' '}
        <div className='font-semibold underline'>Click here to sign up</div>
      </Link>
    </div>
  );
}
