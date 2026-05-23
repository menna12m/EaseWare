import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '@/i18n';

// Always-prefixed routing: even the default locale uses /en/...
export const localePrefix = 'always';

// Re-export typed Link/useRouter/usePathname/redirect that auto-prepend locale.
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix,
});

export { locales, defaultLocale };
