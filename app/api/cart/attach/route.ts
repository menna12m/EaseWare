import { NextResponse, type NextRequest } from 'next/server';
import { customerFetch } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

/**
 * POST /api/cart/attach
 * Body: { cart_id }
 *
 * Associates the current anonymous cart with the signed-in customer.
 * Medusa's store API does this when a `POST /store/carts/:id` arrives with
 * a customer session — the body just needs to be a no-op (empty object).
 */
export async function POST(req: NextRequest) {
  const { cart_id } = (await req.json().catch(() => ({}))) as {
    cart_id?: string;
  };
  if (typeof cart_id !== 'string' || !cart_id) {
    return NextResponse.json({ error: 'cart_id required' }, { status: 422 });
  }

  const { data, status } = await customerFetch(
    `/store/carts/${encodeURIComponent(cart_id)}`,
    { method: 'POST', json: {} }
  );

  if (status === 401) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json(data ?? {}, { status });
}
