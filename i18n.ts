import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Single source of truth — also imported by middleware and routing helpers.
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Each locale's text direction. Used by [locale]/layout.tsx for <html dir>.
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale parameter is one we know about.
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Africa/Cairo',
    now: new Date(),
  };
});
