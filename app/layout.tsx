import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import '@/styles/globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { PageTransition } from '@/components/shared/PageTransition';

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
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Easewear' },
};

export const viewport: Viewport = {
  themeColor: '#FBF8F3',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cloudinaryCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'easewear';
  const algoliaApp = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to the two domains that own first-paint imagery and search */}
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
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
