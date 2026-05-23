import { NextResponse, type NextRequest } from 'next/server';
import { MEDUSA_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/medusa/client';
import { setSessionCookie } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

type Body = {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
};

/**
 * POST /api/auth/register
 *
 * Medusa v2 customer registration is a two-step flow:
 *   1. POST /auth/customer/emailpass/register → returns a short-lived
 *      registration token tied to the auth identity
 *   2. POST /store/customers with that token in the Authorization header,
 *      body carries the customer profile fields → creates the customer
 *
 * Once both succeed we log the user in immediately so they don't have to
 * type the password again, and stash the session JWT in an httpOnly cookie.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const { email, password, first_name, last_name, phone } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'email and password are required' },
      { status: 422 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'password must be at least 8 characters' },
      { status: 422 }
    );
  }

  // 1. Get registration token
  const regRes = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (!regRes.ok) {
    const detail = await regRes.text().catch(() => '');
    return NextResponse.json(
      { error: `registration failed: ${detail || regRes.statusText}` },
      { status: regRes.status }
    );
  }
  const { token: regToken } = (await regRes.json()) as { token: string };

  // 2. Create the customer record with that token
  const customerRes = await fetch(`${MEDUSA_URL}/store/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${regToken}`,
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({
      email,
      first_name: first_name || '',
      last_name: last_name || '',
      phone: phone || undefined,
    }),
    cache: 'no-store',
  });

  if (!customerRes.ok) {
    const detail = await customerRes.text().catch(() => '');
    return NextResponse.json(
      { error: `customer create failed: ${detail || customerRes.statusText}` },
      { status: customerRes.status }
    );
  }

  // 3. Log in immediately so the user is signed in
  const loginRes = await fetch(`${MEDUSA_URL}/auth/customer/emailpass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (!loginRes.ok) {
    return NextResponse.json(
      { ok: true, signedIn: false, message: 'Account created — please sign in.' },
      { status: 201 }
    );
  }

  const { token } = (await loginRes.json()) as { token: string };
  setSessionCookie(token);

  return NextResponse.json({ ok: true, signedIn: true }, { status: 201 });
}
