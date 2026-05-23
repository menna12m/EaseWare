import { NextResponse } from 'next/server';
import { customerFetch } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, status } = await customerFetch('/store/wishlist');
  if (status === 401 || !data) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json(data, { status });
}
