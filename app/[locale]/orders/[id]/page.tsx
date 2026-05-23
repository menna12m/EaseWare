import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { customerFetch } from '@/lib/medusa/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Order confirmation' };

type OrderAddress = {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country_code?: string;
  phone?: string;
};

type OrderItem = {
  id: string;
  title: string;
  quantity: number;
  thumbnail?: string;
  unit_price?: number;
  subtotal?: number;
};

type Order = {
  id: string;
  display_id?: number;
  status?: string;
  currency_code?: string;
  email?: string;
  total?: number;
  subtotal?: number;
  shipping_total?: number;
  created_at?: string;
  items?: OrderItem[];
  shipping_address?: OrderAddress;
};

async function loadOrder(id: string): Promise<Order | null> {
  const fields = [
    'id',
    'display_id',
    'status',
    'currency_code',
    'email',
    'total',
    'subtotal',
    'shipping_total',
    'created_at',
    'items.id',
    'items.title',
    'items.quantity',
    'items.thumbnail',
    'items.unit_price',
    'items.subtotal',
    'shipping_address.*',
  ].join(',');

  const { data } = await customerFetch<{ order: Order }>(
    `/store/orders/${encodeURIComponent(id)}?fields=${encodeURIComponent(fields)}`
  );
  return data?.order ?? null;
}

export default async function OrderPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('OrderConfirmation');

  const order = await loadOrder(params.id);
  if (!order) notFound();

  const fmtMoney = (n: number | undefined) =>
    typeof n === 'number'
      ? `${n.toLocaleString()} ${order.currency_code?.toUpperCase() ?? 'EGP'}`
      : '';
  const fmtDate = (iso?: string) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(
        params.locale === 'ar' ? 'ar-EG' : 'en-GB',
        { day: 'numeric', month: 'long', year: 'numeric' }
      );
    } catch {
      return '';
    }
  };

  const addr = order.shipping_address;

  return (
    <div className="container max-w-3xl py-12">
      {/* Hero / status */}
      <div className="rounded-lg border border-ink/10 bg-cream-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-clay" />
        <h1 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
          {t('thanks')}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">{t('confirmedSentTo', { email: order.email ?? '' })}</p>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <span className="text-ink-soft">
            {t('orderNumber', {
              id: order.display_id ?? order.id.slice(0, 8),
            })}
          </span>
          <Badge variant="secondary">{order.status ?? 'pending'}</Badge>
        </div>
      </div>

      {/* Items */}
      <section className="mt-10">
        <h2 className="font-serif text-xl text-ink">{t('items')}</h2>
        <ul className="mt-3 divide-y divide-ink/10 rounded-lg border border-ink/10">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center gap-3 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-cream-100">
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{item.title}</p>
                <p className="text-xs text-ink-soft">
                  {t('qty', { count: item.quantity })}
                </p>
              </div>
              <span className="text-sm text-ink">
                {fmtMoney(item.subtotal ?? (item.unit_price ?? 0) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Shipping address */}
        {addr && (
          <section>
            <h2 className="font-serif text-xl text-ink">{t('shippingTo')}</h2>
            <address className="mt-3 not-italic text-sm leading-relaxed text-ink">
              {(addr.first_name || addr.last_name) && (
                <p>{`${addr.first_name ?? ''} ${addr.last_name ?? ''}`.trim()}</p>
              )}
              {addr.address_1 && <p>{addr.address_1}</p>}
              {addr.address_2 && <p>{addr.address_2}</p>}
              {(addr.city || addr.province || addr.postal_code) && (
                <p>
                  {[addr.city, addr.province, addr.postal_code]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              {addr.country_code && (
                <p className="uppercase">{addr.country_code}</p>
              )}
              {addr.phone && <p className="text-ink-soft">{addr.phone}</p>}
            </address>
          </section>
        )}

        {/* Totals */}
        <section>
          <h2 className="font-serif text-xl text-ink">{t('totals')}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">{t('subtotal')}</dt>
              <dd>{fmtMoney(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">{t('shipping')}</dt>
              <dd>{fmtMoney(order.shipping_total)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-medium">
              <dt>{t('total')}</dt>
              <dd>{fmtMoney(order.total)}</dd>
            </div>
            {order.created_at && (
              <p className="pt-2 text-xs text-ink-soft">
                {t('placedOn', { date: fmtDate(order.created_at) })}
              </p>
            )}
          </dl>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild variant="clay" size="lg">
          <Link href="/shop">{t('continueShopping')}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/account">{t('viewOrders')}</Link>
        </Button>
      </div>
    </div>
  );
}
