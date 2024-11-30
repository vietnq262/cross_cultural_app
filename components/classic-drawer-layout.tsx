import { cn } from '@/lib/utils';

type ClassicDrawerLayoutProps = {
  className?: string;
  isOpen?: boolean;
  drawerContent: React.ReactNode;
  drawerSide?: 'left' | 'right';
  children: React.ReactNode;
};

export default function ClassicDrawerLayout({
  className,
  isOpen = false,
  drawerContent,
  drawerSide = 'left',
  children,
}: ClassicDrawerLayoutProps) {
  return (
    <div
      className={cn(
        'relative flex',
        drawerSide === 'left' ? 'flex-row-reverse' : 'flex-row',
        className,
      )}
    >
      <div className='z-0 min-w-0 flex-1 md:z-auto overflow-auto'>{children}</div>
      <div
        className={cn(
          'overflow-hidden bg-background transition-all',
          'absolute inset-0 z-10',
          'md:relative md:z-auto',
          isOpen ? 'max-w-full' : 'max-w-0',
        )}
      >
        {drawerContent}
      </div>
    </div>
  );
}
