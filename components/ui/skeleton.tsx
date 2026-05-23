import { cn } from '@/lib/utils/cn';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-md bg-gradient-to-r from-vanilla via-cream-200 to-vanilla bg-[length:200%_100%] animate-shimmer',
        className
      )}
      {...props}
    />
  );
}
