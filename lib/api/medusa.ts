import type { Product, Review } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

async function medusaFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    ...opts,
  });
  if (!res.ok) {
    throw new Error(`Medusa ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ---------- Products ----------

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

// ---------- Reviews ----------

export async function getProductReviews(productId: string): Promise<{ reviews: Review[] }> {
  return medusaFetch(`/store/products/${encodeURIComponent(productId)}/reviews`, {
    next: { revalidate: 60, tags: [`reviews:${productId}`] },
  });
}

export async function submitReview(
  productId: string,
  data: { reviewer_name: string; rating: number; body: string }
): Promise<{ review: Review }> {
  return medusaFetch(`/store/products/${encodeURIComponent(productId)}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
}

// ---------- Cart ----------
// Medusa carts are server-side resources. We persist the cart ID in Zustand and
// hydrate line items by ID. Mutations always go through Medusa first, then the
// store mirrors the response so optimistic UI stays accurate.

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
