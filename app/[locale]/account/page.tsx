import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { AccountWishlist } from './AccountWishlist';

export const metadata = { title: 'My account' };

const SAMPLE_ORDERS: { id: string; date: string; total: string; status: string }[] = [];

export default async function AccountPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Account');

  return (
    <div className="grid gap-12 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <h2 className="font-serif text-2xl text-ink">{t('orderHistory')}</h2>
        {SAMPLE_ORDERS.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">{t('noOrders')}</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/10 rounded-lg border border-ink/10">
            {SAMPLE_ORDERS.map((o) => (
              <li key={o.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-xs text-ink-soft">{o.date}</p>
                </div>
                <span className="text-sm text-ink-soft">{o.status}</span>
                <span className="font-medium">{o.total}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="wishlist">
        <h2 className="font-serif text-2xl text-ink">{t('wishlist')}</h2>
        <AccountWishlist />
      </section>
    </div>
  );
}
