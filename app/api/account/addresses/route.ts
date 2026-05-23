import { NextResponse, type NextRequest } from 'next/server';
import { customerFetch } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, status } = await customerFetch(
    '/store/customers/me/addresses?limit=50'
  );
  if (status === 401 || !data) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json(data, { status });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body?.address_1 || !body?.country_code) {
    return NextResponse.json(
      { error: 'address_1 and country_code are required' },
      { status: 422 }
    );
  }

  const { data, status } = await customerFetch(
    '/store/customers/me/addresses',
    { method: 'POST', json: body }
  );
  if (status === 401) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json(data ?? {}, { status });
}
