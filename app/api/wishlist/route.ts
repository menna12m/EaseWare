import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { mintMedusaCustomerJwt } from '@/lib/medusa/auth';
import { MEDUSA_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/medusa/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const token = mintMedusaCustomerJwt(user.id);
  const res = await fetch(`${MEDUSA_URL}/store/wishlist`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
    cache: 'no-store',
  });

  const body = await res.json().catch(() => ({}));
  return NextResponse.json(body, { status: res.status });
}
