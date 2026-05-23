import { NextResponse, type NextRequest } from 'next/server';
import { customerFetch } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  // Medusa updates addresses via POST (not PATCH) on the same path.
  const body = await req.json().catch(() => ({}));
  const { data, status } = await customerFetch(
    `/store/customers/me/addresses/${encodeURIComponent(params.id)}`,
    { method: 'POST', json: body }
  );
  if (status === 401) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json(data ?? {}, { status });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { status } = await customerFetch(
    `/store/customers/me/addresses/${encodeURIComponent(params.id)}`,
    { method: 'DELETE' }
  );
  if (status === 401) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json({ ok: true }, { status });
}
