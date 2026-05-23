import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

type Order = {
  id: string;
  display_id?: number;
  status?: string;
  currency_code?: string;
  total?: number;
  created_at?: string;
  items?: Array<{
    id: string;
    title: string;
    quantity: number;
    thumbnail?: string | null;
    unit_price?: number;
  }>;
};

function formatMoney(amount: number | undefined, currency: string | undefined) {
  if (typeof amount !== 'number') return '';
  return `${amount.toLocaleString()} ${currency?.toUpperCase() ?? 'EGP'}`;
}

function formatDate(iso: string | undefined, locale: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function StatusBadge({ status }: { status?: string }) {
  const variant =
    status === 'completed' || status === 'archived'
      ? 'default'
      : status === 'canceled'
        ? 'destructive'
        : 'secondary';
  return <Badge variant={variant as any}>{status || 'pending'}</Badge>;
}

export function OrderList({ orders, locale }: { orders: Order[]; locale: string }) {
  const t = useTranslations('Account');

  if (orders.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-ink/15 p-8 text-center">
        <Package className="mx-auto h-8 w-8 text-ink-soft" />
        <p className="mt-3 text-sm text-ink-soft">{t('noOrders')}</p>
        <Button asChild variant="clay" size="sm" className="mt-4">
          <Link href="/shop">{t('startShopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-4">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-lg border border-ink/10 bg-cream-50 p-4 transition-shadow hover:shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-ink">
                {t('orderNumber', { id: order.display_id ?? order.id.slice(0, 8) })}
              </p>
              <p className="text-xs text-ink-soft">
                {formatDate(order.created_at, locale)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <span className="font-medium text-ink">
                {formatMoney(order.total, order.currency_code)}
              </span>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-ink/5 pt-3">
              {order.items.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-md bg-white px-2 py-1 text-xs text-ink-soft"
                >
                  {item.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-8 w-8 rounded object-cover"
                    />
                  )}
                  <span className="max-w-[10rem] truncate">{item.title}</span>
                  <span className="text-ink-soft">×{item.quantity}</span>
                </div>
              ))}
              {order.items.length > 4 && (
                <span className="self-center text-xs text-ink-soft">
                  +{order.items.length - 4}
                </span>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
