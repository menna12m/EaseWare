import { NextResponse, type NextRequest } from 'next/server';
import { MEDUSA_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/medusa/client';
import { setSessionCookie } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

type Body = { email?: string; password?: string };

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json().catch(() => ({}))) as Body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'email and password are required' },
      { status: 422 }
    );
  }

  const res = await fetch(`${MEDUSA_URL}/auth/customer/emailpass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: 'invalid email or password' },
      { status: 401 }
    );
  }

  const { token } = (await res.json()) as { token: string };
  setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
