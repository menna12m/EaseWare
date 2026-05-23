'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LastViewedProduct = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
};

type LastViewedState = {
  products: LastViewedProduct[];
  addProduct: (product: LastViewedProduct) => void;
  clear: () => void;
};

const MAX = 8;

export const useLastViewedStore = create<LastViewedState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((s) => {
          // Dedupe by id, push to front, cap to MAX.
          const filtered = s.products.filter((p) => p.id !== product.id);
          return { products: [product, ...filtered].slice(0, MAX) };
        }),
      clear: () => set({ products: [] }),
    }),
    {
      name: 'easewear-last-viewed',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
