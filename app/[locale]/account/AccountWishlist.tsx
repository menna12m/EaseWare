'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { useWishlistStore } from '@/lib/stores/wishlistStore';

export function AccountWishlist() {
  const t = useTranslations('Account');
  const productIds = useWishlistStore((s) => s.productIds);

  if (productIds.length === 0) {
    return <p className="mt-3 text-sm text-ink-soft">{t('noWishlist')}</p>;
  }

  return (
    <ul className="mt-4 space-y-2 text-sm">
      {productIds.map((id) => (
        <li key={id} className="rounded-md border border-ink/10 px-3 py-2">
          <Link href={`/products/${id}`} className="hover:underline">
            {id}
          </Link>
        </li>
      ))}
    </ul>
  );
}
