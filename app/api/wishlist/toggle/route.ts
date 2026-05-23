import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { mintMedusaCustomerJwt } from '@/lib/medusa/auth';
import { MEDUSA_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/medusa/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const productId = body?.product_id;
  if (typeof productId !== 'string' || !productId) {
    return NextResponse.json({ error: 'product_id required' }, { status: 422 });
  }

  const token = mintMedusaCustomerJwt(user.id);
  const res = await fetch(`${MEDUSA_URL}/store/wishlist/toggle`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ product_id: productId }),
    cache: 'no-store',
  });

  const payload = await res.json().catch(() => ({}));
  return NextResponse.json(payload, { status: res.status });
}
