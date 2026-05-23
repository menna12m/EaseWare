import { Skeleton } from '@/components/ui/skeleton';

export default function ShopLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64" />
      <div className="mt-8 flex gap-8">
        <div className="hidden w-[280px] shrink-0 space-y-3 md:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
