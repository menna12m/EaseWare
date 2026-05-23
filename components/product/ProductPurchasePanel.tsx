'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import { Heart, Minus, Plus, Truck } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useLastViewedStore } from '@/lib/stores/lastViewedStore';
import { ShareWidget } from '@/components/shared/ShareWidget';
import { SizeGuideSheet } from '@/components/shared/SizeGuideSheet';
import { formatPrice } from '@/lib/utils/formatPrice';
import { cn } from '@/lib/utils/cn';

type Props = {
  product: Product;
};

// Parse variant.title like "Sand / M" into { color: "Sand", size: "M" }.
// Falls back to options array if title isn't structured.
function parseVariant(v: ProductVariant): { color?: string; size?: string } {
  if (v.options && v.options.length > 0) {
    const map: Record<string, string> = {};
    for (const opt of v.options) {
      const key = (opt.option?.title || '').toLowerCase();
      if (key) map[key] = opt.value;
    }
    return { color: map.color, size: map.size };
  }
  const [color, size] = v.title.split(/\s*\/\s*/);
  return { color: color?.trim(), size: size?.trim() };
}

export function ProductPurchasePanel({ product }: Props) {
  const t = useTranslations('Product');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const variantMeta = useMemo(
    () => product.variants.map((v) => ({ variant: v, ...parseVariant(v) })),
    [product.variants]
  );

  const colors = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const m of variantMeta) {
      if (m.color && !seen.has(m.color)) {
        seen.add(m.color);
        list.push(m.color);
      }
    }
    return list;
  }, [variantMeta]);

  const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);
  const sizesForColor = useMemo(
    () =>
      variantMeta
        .filter((m) => !selectedColor || m.color === selectedColor)
        .map((m) => m.size)
        .filter((s, i, arr): s is string => Boolean(s) && arr.indexOf(s) === i),
    [variantMeta, selectedColor]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizesForColor[0]);
  const [qty, setQty] = useState(1);

  const selectedVariant = useMemo(
    () =>
      variantMeta.find(
        (m) => (!selectedColor || m.color === selectedColor) && (!selectedSize || m.size === selectedSize)
      )?.variant ?? product.variants[0],
    [variantMeta, selectedColor, selectedSize, product.variants]
  );

  const price = selectedVariant?.prices?.[0]?.amount ?? 0;

  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const isWishlisted = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addLastViewed = useLastViewedStore((s) => s.addProduct);

  // Record last-viewed on mount of this client island.
  useEffect(() => {
    addLastViewed({
      id: product.id,
      title: product.title,
      slug: product.handle,
      image: product.thumbnail,
      price,
    });
    // Intentionally only run once per product mount — price changes don't merit a re-push.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const handleAdd = (buyNow: boolean) => {
    if (!selectedVariant) return;
    startTransition(async () => {
      await addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        title: `${product.title} — ${selectedVariant.title}`,
        price,
        quantity: qty,
        image: product.thumbnail,
      });
      if (buyNow) {
        router.push('/checkout');
      } else {
        setCartOpen(true);
      }
    });
  };

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : `https://vanilla-wear.com/products/${product.handle}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-ink md:text-4xl">{product.title}</h1>
        {product.subtitle && <p className="mt-1 text-ink-soft">{product.subtitle}</p>}
        <p className="mt-3 text-2xl text-ink">{formatPrice(price)}</p>
      </div>

      {colors.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            {t('color')}: <span className="font-normal text-ink-soft">{selectedColor}</span>
          </label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger>
              <SelectValue placeholder={t('color')} />
            </SelectTrigger>
            <SelectContent>
              {colors.map((c) => {
                const hex = product.colors?.find((pc) => pc.name === c)?.hex;
                return (
                  <SelectItem key={c} value={c}>
                    <span className="inline-flex items-center gap-2">
                      {hex && (
                        <span
                          className="h-4 w-4 rounded-full border border-ink/10"
                          style={{ backgroundColor: hex }}
                        />
                      )}
                      {c}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {sizesForColor.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-ink">
              {t('size')}: <span className="font-normal text-ink-soft">{selectedSize}</span>
            </label>
            <SizeGuideSheet />
          </div>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger>
              <SelectValue placeholder={t('size')} />
            </SelectTrigger>
            <SelectContent>
              {sizesForColor.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">{t('quantity')}</label>
        <div className="inline-flex items-center rounded-md border border-ink/20">
          <button
            type="button"
            aria-label={t('quantity')}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center hover:bg-cream-100"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm">{qty}</span>
          <button
            type="button"
            aria-label={t('quantity')}
            onClick={() => setQty((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center hover:bg-cream-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="default" size="lg" disabled={isPending} onClick={() => handleAdd(false)} className="flex-1">
          {isPending ? t('adding') : t('addToBag')}
        </Button>
        <Button variant="clay" size="lg" disabled={isPending} onClick={() => handleAdd(true)} className="flex-1">
          {t('buyNow')}
        </Button>
        <button
          type="button"
          aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
          onClick={() => toggleWishlist(product.id)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-ink/20 hover:bg-cream-100"
        >
          <Heart className={cn('h-5 w-5', isWishlisted ? 'fill-clay text-clay' : 'text-ink')} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-xs text-ink-soft">
          <Truck className="h-4 w-4" />
          {t('freeShipping')}
        </div>
        <ShareWidget url={shareUrl} title={product.title} />
      </div>
    </div>
  );
}
