'use client';

import { useLastViewedStore } from '@/lib/stores/lastViewedStore';
import { HorizontalProductStrip } from '@/components/shared/HorizontalProductStrip';

export function LastViewedStrip() {
  const products = useLastViewedStore((s) => s.products);
  if (products.length === 0) return null;

  return (
    <HorizontalProductStrip
      title="Recently viewed"
      products={products.map((p) => ({
        id: p.id,
        title: p.title,
        handle: p.slug,
        thumbnail: p.image,
        price: p.price,
      }))}
    />
  );
}
