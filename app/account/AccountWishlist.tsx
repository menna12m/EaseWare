'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/lib/stores/wishlistStore';

export function AccountWishlist() {
  const productIds = useWishlistStore((s) => s.productIds);

  if (productIds.length === 0) {
    return (
      <p className="mt-3 text-sm text-ink-soft">
        Nothing saved yet. Tap the heart on any piece to add it here.
      </p>
    );
  }

  return (
    <ul className="mt-4 space-y-2 text-sm">
      {productIds.map((id) => (
        <li key={id} className="rounded-md border border-ink/10 px-3 py-2">
          <Link href={`/products/${id}`} className="hover:underline">
            {id}
          </Link>
        </li>
      ))}
    </ul>
  );
}
