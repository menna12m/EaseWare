import type { Review } from '@/lib/types';
import { StarRating } from '@/components/shared/StarRating';

export function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="rounded-lg border border-ink/10 bg-cream-50 p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-ink">{review.reviewer_name}</p>
        <span className="text-xs text-ink-soft">{date}</span>
      </div>
      <StarRating rating={review.rating} className="mt-1" />
      <p className="mt-3 text-sm leading-relaxed text-ink">{review.body}</p>
    </article>
  );
}
