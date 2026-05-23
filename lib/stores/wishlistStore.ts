'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type WishlistState = {
  productIds: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
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
      isWishlisted: (productId) => get().productIds.includes(productId),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: 'easewear-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
