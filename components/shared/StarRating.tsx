import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type StarRatingProps = {
  rating: number;
  outOf?: number;
  size?: number;
  className?: string;
};

export function StarRating({ rating, outOf = 5, size = 16, className }: StarRatingProps) {
  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} aria-label={`Rated ${rating} out of ${outOf}`}>
      {Array.from({ length: outOf }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            className={filled ? 'fill-clay text-clay' : 'fill-transparent text-ink/30'}
          />
        );
      })}
    </div>
  );
}
