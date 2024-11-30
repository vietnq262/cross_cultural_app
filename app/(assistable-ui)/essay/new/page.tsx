'use client';

import dynamic from 'next/dynamic';

const CreateEssayPage = dynamic(
  () => import('@/components/create-essay-page'),
  {
    ssr: false,
  },
);

export default CreateEssayPage;
