'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/lib/stores/wishlistStore';

/**
 * Mounts once at the root layout. On first render it fetches the signed-in
 * customer's wishlist from /api/wishlist and replaces the local Zustand
 * store with the server's truth — so the heart counter in the header and
 * the heart icons on product cards reflect what's actually saved server-side.
 *
 * When the user is anonymous, /api/wishlist returns 401 and we leave the
 * local store alone — that's fine, the user is browsing without persistence
 * and the local store works as the optimistic-only mirror.
 */
export function WishlistSync() {
  const setAll = useWishlistStore((s) => s.setAll);
  const clear = useWishlistStore((s) => s.clear);

  useEffect(() => {
    let alive = true;
    fetch('/api/wishlist', { cache: 'no-store' })
      .then(async (res) => {
        if (!alive) return;
        if (res.status === 401) {
          // Anonymous — wipe stale ids that may be sitting in localStorage
          // from a previous signed-in session (or pre-auth-refactor leftovers).
          clear();
          return;
        }
        if (!res.ok) return;
        const data = (await res.json()) as { product_ids?: string[] };
        if (Array.isArray(data.product_ids)) {
          setAll(data.product_ids);
        }
      })
      .catch(() => {
        // Network issue — leave the local store alone, next page load will retry.
      });
    return () => {
      alive = false;
    };
  }, [setAll, clear]);

  return null;
}
