'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { CartSheet } from '@/components/shared/CartSheet';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { cn } from '@/lib/utils/cn';

export function Navbar() {
  const t = useTranslations('Nav');
  const [animateLogo, setAnimateLogo] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const setCartOpen = useCartStore((s) => s.setOpen);

  // Sticky-navbar shrink-on-scroll
  const { scrollY } = useScroll();
  const padY = useTransform(scrollY, [0, 80], [20, 10]);

  // Logo intro animation only fires once per session, not on each route change.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem('easewear:logo-seen');
    if (!seen) {
      setAnimateLogo(true);
      sessionStorage.setItem('easewear:logo-seen', '1');
    }
  }, []);

  const navLinks = [
    { label: t('women'), href: '/shop?category=women' },
    { label: t('kids'), href: '/shop?category=kids' },
    { label: t('ourStory'), href: '/about' },
    { label: t('sizeGuide'), href: '/size-guide' },
  ];

  return (
    <>
      <motion.header
        style={{ paddingTop: padY, paddingBottom: padY }}
        className="sticky top-0 z-40 border-b border-ink/5 bg-cream-50/90 backdrop-blur-md"
      >
        <div className="container flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center" aria-label={t('home')}>
            <motion.span
              initial={animateLogo ? { opacity: 0, y: -8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="font-serif text-2xl tracking-tight text-ink"
            >
              easewear
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <LanguageSwitcher />

            <Link
              href="/shop"
              aria-label={t('search')}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-100"
            >
              <Search className="h-5 w-5 text-ink" />
            </Link>

            <Link
              href={{ pathname: '/account', hash: 'wishlist' }}
              aria-label={`${t('wishlist')} (${wishlistCount})`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-100"
            >
              <Heart className="h-5 w-5 text-ink" />
              {wishlistCount > 0 && <NavBadge count={wishlistCount} />}
            </Link>

            <button
              type="button"
              aria-label={`${t('cart')} (${cartCount})`}
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-100"
            >
              <ShoppingBag className="h-5 w-5 text-ink" />
              {cartCount > 0 && <NavBadge count={cartCount} />}
            </button>

            <Link
              href="/account"
              aria-label={t('account')}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-100"
            >
              <User className="h-5 w-5 text-ink" />
            </Link>
          </div>
        </div>
      </motion.header>

      <CartSheet />
    </>
  );
}

function NavBadge({ count }: { count: number }) {
  return (
    <span
      className={cn(
        // -end-1 (logical) instead of -right-1 so the badge sits in the right place in RTL too.
        'absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-medium text-cream-50'
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
