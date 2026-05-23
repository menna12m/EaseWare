import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/lib/i18n/routing';
import { getCurrentCustomer } from '@/lib/medusa/session';

export default async function AccountLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Account');

  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect({ pathname: '/login', query: { redirectTo: '/account' } } as any);
  }

  const displayName =
    customer!.first_name || customer!.email?.split('@')[0] || '';

  return (
    <div className="container py-12">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">
            {t('eyebrow')}
          </p>
          <h1 className="mt-1 font-serif text-3xl text-ink">
            {t('welcome', { name: displayName })}
          </h1>
        </div>
        <nav className="flex gap-4 text-sm text-ink-soft">
          <Link href="/account" className="hover:text-ink">
            {t('orders')}
          </Link>
          <Link
            href={{ pathname: '/account', hash: 'wishlist' }}
            className="hover:text-ink"
          >
            {t('wishlist')}
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="hover:text-ink">
              {t('signOut')}
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
