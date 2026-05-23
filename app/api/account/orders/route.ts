import { NextResponse, type NextRequest } from 'next/server';
import { customerFetch } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/account/orders?limit=20&offset=0
 *
 * Calls Medusa's `/store/orders` with the customer's session cookie.
 * Medusa scopes the result to the signed-in customer automatically when
 * the customer JWT is attached.
 */
export async function GET(req: NextRequest) {
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? 20), 100);
  const offset = Math.max(Number(req.nextUrl.searchParams.get('offset') ?? 0), 0);

  const fields = [
    'id',
    'display_id',
    'status',
    'currency_code',
    'total',
    'subtotal',
    'created_at',
    'items.id',
    'items.title',
    'items.quantity',
    'items.thumbnail',
    'items.unit_price',
    'shipping_address.first_name',
    'shipping_address.last_name',
    'shipping_address.city',
  ].join(',');

  const { data, status } = await customerFetch(
    `/store/orders?limit=${limit}&offset=${offset}&fields=${encodeURIComponent(fields)}&order=-created_at`
  );

  if (status === 401 || !data) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json(data, { status });
}
