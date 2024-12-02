import Link from 'next/link';

import SignupWithCredentialForm from '@/components/signup-with-credential-form';

import LoginSocialButton from './login-social-button';

export default function SignupForm() {
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
          Please sign up to continue.
        </h1>

        <SignupWithCredentialForm />

        <div className='py-4 text-center text-sm text-muted-foreground'>or</div>

        <div className='space-y-2'>
          <LoginSocialButton className='w-full' providerId='google'>
            Continue with Google account
          </LoginSocialButton>
        </div>
      </div>

      <Link
        href='/auth/sign-in'
        className='flex flex-row gap-1 text-sm text-muted-foreground'
      >
        Already have an account?{' '}
        <div className='font-semibold underline'>Click here to login</div>
      </Link>
    </div>
  );
}
