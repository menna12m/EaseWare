import 'server-only';
import { cookies } from 'next/headers';
import { MEDUSA_URL, MEDUSA_PUBLISHABLE_KEY } from './client';

/**
 * Cookie-based Medusa customer session.
 *
 * We store the JWT Medusa returns from /auth/customer/emailpass in an
 * httpOnly cookie. Server routes read it and forward it as
 * `Authorization: Bearer <token>` on Medusa store calls; the browser never
 * touches the token directly.
 */

export const SESSION_COOKIE = 'medusa_customer_token';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setSessionCookie(token: string) {
  cookies().set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function getSessionToken(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value || undefined;
}

/**
 * Fetch the signed-in customer from Medusa.
 * Returns null when no session cookie OR when the token is rejected.
 */
export async function getCurrentCustomer(): Promise<{
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
} | null> {
  const token = getSessionToken();
  if (!token) return null;

  const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { customer: any };
  return data.customer ?? null;
}

/**
 * Helper for bridge routes — fetch a Medusa store endpoint with the current
 * customer's session attached. Returns the parsed JSON.
 */
export async function customerFetch<T = unknown>(
  path: string,
  init: RequestInit & { json?: unknown } = {}
): Promise<{ data: T | null; status: number }> {
  const token = getSessionToken();
  if (!token) return { data: null, status: 401 };

  const { json, headers, ...rest } = init;
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
      ...(headers as Record<string, string> | undefined),
    },
    body: json !== undefined ? JSON.stringify(json) : init.body,
    cache: 'no-store',
  });

  if (res.status === 204) return { data: null, status: 204 };
  const data = (await res.json().catch(() => null)) as T | null;
  return { data, status: res.status };
}
