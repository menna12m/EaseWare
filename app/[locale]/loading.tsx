import { Skeleton } from '@/components/ui/skeleton';

export default function RootLoading() {
  return (
    <div className="container py-16">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="mt-4 h-6 w-1/3" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full" />
        ))}
      </div>
    </div>
  );
}
