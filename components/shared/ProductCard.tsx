'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import type { ProductCardModel } from '@/lib/types';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { formatPrice } from '@/lib/utils/formatPrice';
import { cn } from '@/lib/utils/cn';

type ProductCardProps = {
  product: ProductCardModel;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isWishlisted = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-clay rounded-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-cream-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className={cn(
            'object-cover transition-opacity duration-500',
            product.backImage && 'group-hover:opacity-0'
          )}
        />
        {product.backImage && (
          <Image
            src={product.backImage}
            alt={`${product.title} — back view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isWishlisted}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/90 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              isWishlisted ? 'fill-clay text-clay' : 'text-ink'
            )}
          />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-ink">{product.title}</h3>
          {product.colors && product.colors.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1">
              {product.colors.slice(0, 5).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-3 w-3 rounded-full border border-ink/10"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-ink-soft">+{product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
        <p className="shrink-0 text-sm font-medium text-ink">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
