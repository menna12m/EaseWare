import type { Metadata } from 'next';
import { ReviewCard } from '@/components/product/ReviewCard';
import { StarRating } from '@/components/shared/StarRating';
import { getProducts, getProductReviews } from '@/lib/api/medusa';
import type { Review } from '@/lib/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'What easewear customers are saying — fabric, fit, fall.',
};

async function loadAllReviews(): Promise<Review[]> {
  try {
    const { products } = await getProducts({ limit: 50 });
    const results = await Promise.allSettled(products.map((p) => getProductReviews(p.id)));
    const reviews = results.flatMap((r) => (r.status === 'fulfilled' ? r.value.reviews : []));
    // Newest first
    return reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await loadAllReviews();
  const avg =
    reviews.length === 0 ? 0 : reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="container py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">Reviews</p>
        <h1 className="mt-2 font-serif text-4xl text-ink md:text-5xl">
          {reviews.length} women, in their own words.
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <StarRating rating={avg} size={20} />
          <span className="text-ink-soft">{avg.toFixed(1)} average across the collection</span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.length === 0 ? (
          <p className="text-ink-soft">No reviews yet — be the first.</p>
        ) : (
          reviews.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </div>
  );
}
