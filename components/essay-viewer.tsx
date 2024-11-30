import { Essay } from '@/lib/types';

import EssayAuthorInfo from './essay-author-info';

type EssayViewerProps = {
  essay: Essay;
  hideAuthor?: boolean;
};

export default function EssayViewer({ essay, hideAuthor }: EssayViewerProps) {
  return (
    <div className='space-y-8 py-4'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-bold'>{essay.title}</h1>
        <div className='flex md:items-center gap-2 md:flex-row items-start flex-col'>
          {!hideAuthor && <EssayAuthorInfo userId={essay.createdBy} />}
        </div>
      </div>

      <div className='space-y-6'>
        <section>
          <h2 className='text-lg font-bold mb-2'>Introduction</h2>
          <p>{essay.introduction}</p>
        </section>
        <section>
          <h2 className='text-lg font-bold mb-2'>Body</h2>
          <p>{essay.body}</p>
        </section>
        <section>
          <h2 className='text-lg font-bold mb-2'>Conclusion</h2>
          <p>{essay.conclusion}</p>
        </section>
      </div>
    </div>
  );
}
