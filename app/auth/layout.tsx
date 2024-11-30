import { PropsWithChildren } from 'react';

export default function AuthLayout(props: PropsWithChildren) {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
      {props.children}
    </div>
  );
}
