import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n';
import { localePrefix } from '@/lib/i18n/routing';
import { SESSION_COOKIE } from '@/lib/medusa/session';

// next-intl handles locale detection, prefix enforcement, and Accept-Language fallback.
const intlMiddleware = createIntlMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix,
});

function pathWithoutLocale(pathname: string): string {
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length === 0) return '/';
  return locales.includes(segs[0] as (typeof locales)[number])
    ? '/' + segs.slice(1).join('/')
    : pathname;
}

export function middleware(request: NextRequest) {
  // Skip i18n/auth for API and auth-action routes — they're locale-agnostic.
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/auth/')
  ) {
    return NextResponse.next();
  }

  // 1) Locale resolution
  const intlResponse = intlMiddleware(request);
  if (intlResponse.headers.get('location')) {
    return intlResponse;
  }

  // 2) Gate /account on the Medusa session cookie.
  const cleanPath = pathWithoutLocale(request.nextUrl.pathname);
  if (cleanPath.startsWith('/account')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const localeSeg = request.nextUrl.pathname.split('/')[1];
      const useLocale = locales.includes(localeSeg as (typeof locales)[number])
        ? localeSeg
        : defaultLocale;
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${useLocale}/login`;
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
