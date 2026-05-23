'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Medusa from '@/lib/api/medusa';

export type CartItem = {
  lineItemId?: string; // assigned by Medusa once persisted
  variantId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  medusaCartId: string | null;
  isHydrating: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  ensureCart: () => Promise<string>;
  addItem: (item: Omit<CartItem, 'lineItemId'>) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateQty: (variantId: string, qty: number) => Promise<void>;
  clearCart: () => void;
  totalCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      medusaCartId: null,
      isHydrating: false,
      isOpen: false,

      setOpen: (open) => set({ isOpen: open }),

      // Lazily create a Medusa cart the first time the user adds something.
      // Once we have an ID, every mutation goes through Medusa first; local state
      // is reconciled from the server response so totals stay authoritative.
      ensureCart: async () => {
        const existing = get().medusaCartId;
        if (existing) return existing;
        const { cart } = await Medusa.createCart();
        set({ medusaCartId: cart.id });
        return cart.id;
      },

      addItem: async (item) => {
        const cartId = await get().ensureCart();
        try {
          const { cart } = await Medusa.addToCart(cartId, item.variantId, item.quantity);
          // Reconcile local from server
          set({
            items: cart.items.map((li) => ({
              lineItemId: li.id,
              variantId: li.variant_id,
              productId: li.product_id,
              title: li.title,
              price: li.unit_price,
              quantity: li.quantity,
              image: li.thumbnail,
            })),
          });
        } catch (err) {
          // Optimistic fallback: at least show the item locally
          const existing = get().items.find((i) => i.variantId === item.variantId);
          if (existing) {
            set({
              items: get().items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            });
          } else {
            set({ items: [...get().items, item] });
          }
          throw err;
        }
      },

      removeItem: async (variantId) => {
        const target = get().items.find((i) => i.variantId === variantId);
        const cartId = get().medusaCartId;
        if (cartId && target?.lineItemId) {
          try {
            const { cart } = await Medusa.removeLineItem(cartId, target.lineItemId);
            set({
              items: cart.items.map((li) => ({
                lineItemId: li.id,
                variantId: li.variant_id,
                productId: li.product_id,
                title: li.title,
                price: li.unit_price,
                quantity: li.quantity,
                image: li.thumbnail,
              })),
            });
            return;
          } catch {
            // fall through to local removal
          }
        }
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQty: async (variantId, qty) => {
        if (qty <= 0) return get().removeItem(variantId);
        const target = get().items.find((i) => i.variantId === variantId);
        const cartId = get().medusaCartId;
        if (cartId && target?.lineItemId) {
          try {
            const { cart } = await Medusa.updateLineItem(cartId, target.lineItemId, qty);
            set({
              items: cart.items.map((li) => ({
                lineItemId: li.id,
                variantId: li.variant_id,
                productId: li.product_id,
                title: li.title,
                price: li.unit_price,
                quantity: li.quantity,
                image: li.thumbnail,
              })),
            });
            return;
          } catch {
            // fall through
          }
        }
        set({
          items: get().items.map((i) => (i.variantId === variantId ? { ...i, quantity: qty } : i)),
        });
      },

      clearCart: () => set({ items: [], medusaCartId: null }),

      totalCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: 'easewear-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, medusaCartId: s.medusaCartId }),
    }
  )
);
