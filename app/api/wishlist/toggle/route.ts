import { NextResponse, type NextRequest } from 'next/server';
import { customerFetch } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const product_id = body?.product_id;
  if (typeof product_id !== 'string' || !product_id) {
    return NextResponse.json({ error: 'product_id required' }, { status: 422 });
  }

  const { data, status } = await customerFetch('/store/wishlist/toggle', {
    method: 'POST',
    json: { product_id },
  });

  if (status === 401) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json(data ?? {}, { status });
}
