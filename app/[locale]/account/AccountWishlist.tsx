'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, X } from 'lucide-react';
import { getWishlist, toggleWishlist } from '@/lib/api/medusa';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import type { Product } from '@/lib/types';

type WishlistResponse = {
  product_ids: string[];
  products: Product[];
};

export function AccountWishlist() {
  const t = useTranslations('Account');
  const [data, setData] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<Set<string>>(new Set());
  const localToggle = useWishlistStore((s) => s.toggle);

  useEffect(() => {
    let alive = true;
    getWishlist()
      .then((res) => {
        if (alive) setData(res);
      })
      .catch(() => {
        if (alive) setData({ product_ids: [], products: [] });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const handleRemove = async (productId: string) => {
    setRemoving((prev) => new Set(prev).add(productId));
    try {
      await toggleWishlist(productId);
      localToggle(productId); // keep local store + UI heart icons in sync
      setData((prev) =>
        prev
          ? {
              product_ids: prev.product_ids.filter((id) => id !== productId),
              products: prev.products.filter((p) => p.id !== productId),
            }
          : prev
      );
    } finally {
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-4 space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-ink/15 p-8 text-center">
        <Heart className="mx-auto h-8 w-8 text-ink-soft" />
        <p className="mt-3 text-sm text-ink-soft">{t('noWishlist')}</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/shop">{t('startBrowsing')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-3">
      {data.products.map((p) => {
        const price = p.variants?.[0]?.prices?.find(
          (pr) => pr.currency_code?.toLowerCase() === 'egp'
        )?.amount;
        const isRemoving = removing.has(p.id);
        return (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-lg border border-ink/10 p-3 transition-opacity"
            style={{ opacity: isRemoving ? 0.5 : 1 }}
          >
            <Link
              href={`/products/${p.handle}`}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-cream-100"
            >
              {p.thumbnail && (
                <Image
                  src={p.thumbnail}
                  alt={p.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${p.handle}`}
                className="block truncate font-medium text-ink hover:underline"
              >
                {p.title}
              </Link>
              {price ? (
                <p className="text-sm text-ink-soft">{price} EGP</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => handleRemove(p.id)}
              disabled={isRemoving}
              className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-50"
              aria-label={t('removeFromWishlist')}
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
