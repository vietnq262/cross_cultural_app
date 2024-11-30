interface EssayPreviewProps {
  title: string;
  introduction: string;
  body: string;
  conclusion: string;
}

export default function EssayPreview({
  title,
  introduction,
  body,
  conclusion,
}: EssayPreviewProps) {
  return (
    <div className='space-y-6 prose'>
      <h1>{title}</h1>
      <div className='space-y-4'>
        <p>{introduction}</p>
        <p>{body}</p>
        <p>{conclusion}</p>
      </div>
    </div>
  );
}
