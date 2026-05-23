import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import '@/styles/globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { PageTransition } from '@/components/shared/PageTransition';
import { WishlistSync } from '@/components/shared/WishlistSync';
import { locales, localeDirection, type Locale } from '@/i18n';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vanilla-wear.com'),
  title: {
    default: 'Easewear — Comfort-wear for every woman',
    template: '%s · Easewear',
  },
  description:
    'Easewear is comfort-wear designed for every woman’s body, day, and mood. Soft fabrics, perfect fit, made in Egypt.',
  openGraph: {
    title: 'Easewear',
    description: 'Comfort-wear for every woman, made in Egypt.',
    url: 'https://vanilla-wear.com',
    siteName: 'Easewear',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Easewear' },
};

export const viewport: Viewport = {
  themeColor: '#FBF8F3',
  width: 'device-width',
  initialScale: 1,
};

// Pre-render both locales at build time so first-paint is instant.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  // Required when using App Router + static rendering with next-intl.
  unstable_setRequestLocale(locale);

  const messages = await getMessages();
  const dir = localeDirection[locale as Locale];

  const algoliaApp = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to domains that own first-paint imagery and search. */}
        <link rel="preconnect" href={`https://res.cloudinary.com`} />
        <link rel="dns-prefetch" href={`https://res.cloudinary.com`} />
        {algoliaApp && (
          <>
            <link rel="preconnect" href={`https://${algoliaApp}-dsn.algolia.net`} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={`https://${algoliaApp}-dsn.algolia.net`} />
          </>
        )}
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <WishlistSync />
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
