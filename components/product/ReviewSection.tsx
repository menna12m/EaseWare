'use client';

import { useState, useMemo } from 'react';
import type { Review } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/shared/StarRating';
import { ReviewCard } from '@/components/product/ReviewCard';
import { submitReview } from '@/lib/api/medusa';

type Props = {
  productId: string;
  initialReviews: Review[];
};

export function ReviewSection({ productId, initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    const total = reviews.length;
    const distribution = [0, 0, 0, 0, 0];
    let sum = 0;
    for (const r of reviews) {
      sum += r.rating;
      const idx = Math.min(Math.max(Math.round(r.rating), 1), 5) - 1;
      distribution[idx] += 1;
    }
    return { avg: sum / total, total, distribution };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      const { review } = await submitReview(productId, {
        reviewer_name: name.trim(),
        rating,
        body: body.trim(),
      });
      setReviews((prev) => [review, ...prev]);
      setOpen(false);
      setName('');
      setBody('');
      setRating(5);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl text-ink md:text-3xl">Customer reviews</h2>
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={stats.avg} size={18} />
            <span className="text-sm text-ink-soft">
              {stats.avg.toFixed(1)} · {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Write a review</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share your experience</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div>
                <label className="mb-2 block text-sm text-ink">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n === 1 ? '' : 's'}`}
                      className="p-1"
                    >
                      <StarRating rating={n <= rating ? 1 : 0} outOf={1} size={26} />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="What did you love? How does it fit?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                required
              />
              <Button type="submit" variant="clay" disabled={submitting} className="w-full">
                {submitting ? 'Submitting…' : 'Submit review'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {stats.total > 0 && (
        <div className="mt-6 grid gap-2 md:max-w-md">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = stats.distribution[n - 1];
            const pct = stats.total ? (count / stats.total) * 100 : 0;
            return (
              <div key={n} className="flex items-center gap-3 text-sm">
                <span className="w-6 text-ink-soft">{n}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-100">
                  <div className="h-full bg-clay transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 text-right text-ink-soft">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {reviews.length === 0 ? (
          <p className="text-sm text-ink-soft">Be the first to review this piece.</p>
        ) : (
          reviews.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </section>
  );
}
