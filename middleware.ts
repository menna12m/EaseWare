import { createServerClient, type CookieOptions } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n';
import { localePrefix } from '@/lib/i18n/routing';

// next-intl handles locale detection, prefix enforcement, and Accept-Language fallback.
const intlMiddleware = createIntlMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix,
});

// Paths under /account require auth. Strip the locale prefix before comparing.
function pathWithoutLocale(pathname: string): string {
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length === 0) return '/';
  return locales.includes(segs[0] as (typeof locales)[number])
    ? '/' + segs.slice(1).join('/')
    : pathname;
}

export async function middleware(request: NextRequest) {
  // Skip i18n/auth for API and auth-action routes — they're locale-agnostic.
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/auth/')
  ) {
    return NextResponse.next();
  }

  // 1) Run the i18n middleware first to get the locale-correct response (with
  //    cookies and headers it sets). If it returns a redirect, honor it.
  const intlResponse = intlMiddleware(request);
  if (intlResponse.headers.get('location')) {
    return intlResponse;
  }

  // 2) Layer Supabase auth on top — refresh sessions and gate /account.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cleanPath = pathWithoutLocale(request.nextUrl.pathname);

  if (!supabaseUrl || !supabaseAnonKey) {
    if (cleanPath.startsWith('/account')) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${defaultLocale}/login`;
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return intlResponse;
  }

  // Merge intl's response (which already carries the right cookies/headers)
  // with Supabase's session-refresh response. We pass intl's mutated request
  // through and ensure Supabase writes cookies to the SAME response.
  let response = intlResponse;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (cleanPath.startsWith('/account') && !user) {
    const redirectUrl = request.nextUrl.clone();
    // Preserve the user's chosen locale on the login redirect.
    const localeSeg = request.nextUrl.pathname.split('/')[1];
    const useLocale = locales.includes(localeSeg as (typeof locales)[number])
      ? localeSeg
      : defaultLocale;
    redirectUrl.pathname = `/${useLocale}/login`;
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  // Run on everything except next internals and static asset extensions.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
