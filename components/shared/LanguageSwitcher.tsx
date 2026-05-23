'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/lib/i18n/routing';
import { Languages } from 'lucide-react';
import { locales, type Locale } from '@/i18n';

// Swaps the locale segment of the current path while preserving everything else.
// `usePathname` from our i18n helper returns the path WITHOUT the locale prefix,
// and `router.replace(pathname, { locale })` re-prepends the chosen one.
export function LanguageSwitcher() {
  const t = useTranslations('Language');
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const nextLocale: Locale = currentLocale === 'en' ? 'ar' : 'en';

  const handleSwitch = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      type="button"
      aria-label={t('switch')}
      onClick={handleSwitch}
      disabled={isPending}
      className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-ink hover:bg-cream-100"
    >
      <Languages className="h-4 w-4" aria-hidden />
      <span className="font-medium">{t(nextLocale)}</span>
    </button>
  );
}
