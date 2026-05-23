'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type WishlistState = {
  productIds: string[];
  /** Pure local toggle (no server call). Used by syncFromServer + optimistic UI. */
  toggle: (productId: string) => void;
  /** Optimistic toggle that also POSTs to /api/wishlist/toggle when the user
   *  is signed in. Falls back to local-only when the API returns 401. */
  toggleEverywhere: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  /** Replace the entire list — used by the boot-time sync to make the server
   *  the source of truth. */
  setAll: (productIds: string[]) => void;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) =>
        set((s) => ({
          productIds: s.productIds.includes(productId)
            ? s.productIds.filter((id) => id !== productId)
            : [...s.productIds, productId],
        })),
      toggleEverywhere: async (productId) => {
        // Optimistic local update first so the heart icon flips immediately
        const wasIn = get().productIds.includes(productId);
        get().toggle(productId);

        try {
          const res = await fetch('/api/wishlist/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId }),
          });
          if (res.status === 401) {
            // Anonymous user — keep the local-only optimistic state, no server sync.
            return;
          }
          if (!res.ok) {
            // Server rejected — roll back local
            set((s) => ({
              productIds: wasIn
                ? [...s.productIds, productId]
                : s.productIds.filter((id) => id !== productId),
            }));
          }
        } catch {
          // Network error — leave optimistic state; sync on next page load
        }
      },
      isWishlisted: (productId) => get().productIds.includes(productId),
      setAll: (productIds) => set({ productIds }),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: 'easewear-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
