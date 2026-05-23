'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { useCartStore } from '@/lib/stores/cartStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/formatPrice';

export function CartSheet() {
  const t = useTranslations('Cart');
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('title')}</SheetTitle>
          <p className="text-sm text-ink-soft">
            {items.length === 0
              ? t('empty')
              : items.length === 1
                ? t('pieceOne')
                : t('pieceOther', { count: items.length })}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-ink-soft">{t('emptyHint')}</p>
              <Button asChild variant="clay" onClick={() => setOpen(false)}>
                <Link href="/shop">{t('browse')}</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-3">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-cream-100">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="text-sm text-ink-soft">{formatPrice(item.price)}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-md border border-ink/20">
                        <button
                          type="button"
                          aria-label={t('decrease')}
                          onClick={() => updateQty(item.variantId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center hover:bg-cream-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={t('increase')}
                          onClick={() => updateQty(item.variantId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center hover:bg-cream-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={t('remove')}
                        onClick={() => removeItem(item.variantId)}
                        className="text-ink-soft hover:text-ink"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-ink-soft">{t('subtotal')}</span>
              <span className="text-lg font-medium text-ink">{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs text-ink-soft">{t('taxNote')}</p>
            <Button asChild variant="clay" size="lg" className="w-full">
              <Link href="/checkout" onClick={() => setOpen(false)}>
                {t('checkout')}
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
