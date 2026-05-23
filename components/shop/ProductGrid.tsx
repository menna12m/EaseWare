'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useInfiniteHits } from 'react-instantsearch';
import { ProductCard } from '@/components/shared/ProductCard';
import type { ProductCardModel } from '@/lib/types';

// Algolia hit shape we expect from indexing. Records should mirror this when
// pushed to the `easewear_products` index.
type Hit = {
  objectID: string;
  title: string;
  handle: string;
  thumbnail: string;
  back_image?: string;
  price: number;
  colors?: { name: string; hex: string }[];
};

export function ProductGrid() {
  const t = useTranslations('Shop');
  const { hits, isLastPage, showMore } = useInfiniteHits<Hit>();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Auto-load next page when the sentinel scrolls into view.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLastPage) {
          showMore();
        }
      },
      { rootMargin: '300px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isLastPage, showMore]);

  if (hits.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-ink/15 text-sm text-ink-soft">
        {t('noResults')}
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hits.map((h, i) => {
          const product: ProductCardModel = {
            id: h.objectID,
            title: h.title,
            handle: h.handle,
            thumbnail: h.thumbnail,
            backImage: h.back_image,
            price: h.price,
            colors: h.colors,
          };
          return <ProductCard key={h.objectID} product={product} priority={i < 3} />;
        })}
      </div>
      <div ref={sentinelRef} className="h-12" aria-hidden />
      {isLastPage && hits.length > 12 && (
        <p className="mt-6 text-center text-sm text-ink-soft">{t('endOfResults')}</p>
      )}
    </div>
  );
}
