import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { Mail, User } from 'lucide-react';
import { AccountWishlist } from './AccountWishlist';
import { OrderList } from './_components/OrderList';
import { getCurrentCustomer, customerFetch } from '@/lib/medusa/session';

export const metadata = { title: 'My account' };

type OrdersResponse = { orders: any[]; count: number };

async function loadOrders(): Promise<OrdersResponse> {
  const fields = [
    'id',
    'display_id',
    'status',
    'currency_code',
    'total',
    'created_at',
    'items.id',
    'items.title',
    'items.quantity',
    'items.thumbnail',
    'items.unit_price',
  ].join(',');

  const { data } = await customerFetch<OrdersResponse>(
    `/store/orders?limit=20&order=-created_at&fields=${encodeURIComponent(fields)}`
  );
  return data ?? { orders: [], count: 0 };
}

export default async function AccountPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Account');

  const [customer, ordersRes] = await Promise.all([
    getCurrentCustomer(),
    loadOrders(),
  ]);

  return (
    <div className="space-y-12">
      {/* Profile summary card */}
      {customer && (
        <section className="rounded-lg border border-ink/10 bg-cream-50 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clay text-cream-50">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-ink">
                {customer.first_name || customer.last_name
                  ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
                  : customer.email}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-ink-soft">
                <Mail className="h-3.5 w-3.5" />
                {customer.email}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-12 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="font-serif text-2xl text-ink">{t('orderHistory')}</h2>
          <OrderList orders={ordersRes.orders ?? []} locale={locale} />
        </section>

        <section id="wishlist">
          <h2 className="font-serif text-2xl text-ink">{t('wishlist')}</h2>
          <AccountWishlist />
        </section>
      </div>
    </div>
  );
}
