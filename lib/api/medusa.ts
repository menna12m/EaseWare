import type { Product, Review } from '@/lib/types';
import { MEDUSA_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/medusa/client';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

async function medusaFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> | undefined),
  };

  // Every /store/* request needs the publishable key. Custom routes inherit
  // the same auth model.
  if (MEDUSA_PUBLISHABLE_KEY && !headers['x-publishable-api-key']) {
    headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY;
  }

  const res = await fetch(`${MEDUSA_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Medusa ${path} failed: ${res.status} ${res.statusText}${body ? ` — ${body}` : ''}`
    );
  }
  return res.json() as Promise<T>;
}

// ─── Products ──────────────────────────────────────────────────────────────

export type GetProductsParams = {
  limit?: number;
  offset?: number;
  order?: string;
  collection_id?: string;
  category_id?: string;
  q?: string;
};

export async function getProducts(
  params: GetProductsParams = {}
): Promise<{ products: Product[]; count: number }> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && qs.set(k, String(v)));
  return medusaFetch(`/store/products?${qs.toString()}`, {
    next: { revalidate: 60, tags: ['products'] },
  });
}

export async function getProductByHandle(handle: string): Promise<{ product: Product }> {
  return medusaFetch(`/store/products/handle/${encodeURIComponent(handle)}`, {
    next: { revalidate: 30, tags: ['products', `product:${handle}`] },
  });
}

export async function getProductsByPersona(slug: string): Promise<{ products: Product[] }> {
  return medusaFetch(`/store/products/by-persona/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60, tags: ['products', `persona:${slug}`] },
  });
}

export type FabricFilterParams = {
  fabric_front?: string;
  fabric_back?: string;
  fabric_lining?: string;
  category?: 'women' | 'kids';
  product_type?: 'capsule' | 'set';
  size?: string;
  color?: string;
  limit?: number;
  offset?: number;
};

export async function getProductsByFabricFilter(
  params: FabricFilterParams = {}
): Promise<{ products: Product[]; count: number; limit: number; offset: number }> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && qs.set(k, String(v)));
  return medusaFetch(`/store/products/fabric-filter?${qs.toString()}`, {
    next: { revalidate: 60, tags: ['products', 'fabric-filter'] },
  });
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export async function getProductReviews(
  productId: string
): Promise<{ reviews: Review[]; average_rating: number; total: number }> {
  return medusaFetch(`/store/products/${encodeURIComponent(productId)}/reviews`, {
    next: { revalidate: 60, tags: [`reviews:${productId}`] },
  });
}

export async function submitReview(
  productId: string,
  data: { customer_name: string; rating: number; body: string }
): Promise<{ review: Review }> {
  return medusaFetch(`/store/products/${encodeURIComponent(productId)}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
}

// ─── Wishlist ──────────────────────────────────────────────────────────────
// Client-side helpers that hit Next.js' /api/wishlist bridge, which forwards
// to Medusa with a server-minted JWT. The Supabase session is enforced on
// the bridge side — never call Medusa's /store/wishlist directly from the
// browser, the JWT must stay server-side.

export async function getWishlist(): Promise<{
  product_ids: string[];
  products: Product[];
}> {
  const res = await fetch('/api/wishlist', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Wishlist GET failed: ${res.status}`);
  return res.json();
}

export async function toggleWishlist(
  productId: string
): Promise<{ product_ids: string[]; action: 'added' | 'removed' }> {
  const res = await fetch('/api/wishlist/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId }),
  });
  if (!res.ok) throw new Error(`Wishlist toggle failed: ${res.status}`);
  return res.json();
}

// ─── Cart ──────────────────────────────────────────────────────────────────
// Medusa carts are server-side resources. We persist the cart ID in Zustand
// and hydrate line items by ID. Mutations always go through Medusa first, then
// the store mirrors the response so optimistic UI stays accurate.

export type MedusaCart = {
  id: string;
  items: {
    id: string;
    variant_id: string;
    product_id: string;
    title: string;
    quantity: number;
    unit_price: number;
    thumbnail?: string;
  }[];
  total?: number;
  subtotal?: number;
};

export async function createCart(): Promise<{ cart: MedusaCart }> {
  return medusaFetch('/store/carts', { method: 'POST', body: '{}', cache: 'no-store' });
}

export async function getCart(cartId: string): Promise<{ cart: MedusaCart }> {
  return medusaFetch(`/store/carts/${encodeURIComponent(cartId)}`, { cache: 'no-store' });
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<{ cart: MedusaCart }> {
  return medusaFetch(`/store/carts/${encodeURIComponent(cartId)}/line-items`, {
    method: 'POST',
    body: JSON.stringify({ variant_id: variantId, quantity }),
    cache: 'no-store',
  });
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<{ cart: MedusaCart }> {
  return medusaFetch(
    `/store/carts/${encodeURIComponent(cartId)}/line-items/${encodeURIComponent(lineItemId)}`,
    {
      method: 'POST',
      body: JSON.stringify({ quantity }),
      cache: 'no-store',
    }
  );
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<{ cart: MedusaCart }> {
  return medusaFetch(
    `/store/carts/${encodeURIComponent(cartId)}/line-items/${encodeURIComponent(lineItemId)}`,
    { method: 'DELETE', cache: 'no-store' }
  );
}
