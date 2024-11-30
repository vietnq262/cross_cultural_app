import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  );
}

function SkeletonText({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      className={cn(
        'inline-block animate-pulse rounded-md bg-primary/10',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton, SkeletonText };
