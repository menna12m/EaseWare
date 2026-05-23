import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { Instagram, Facebook, Mail } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Footer');
  const cols = [
    {
      title: t('shop'),
      links: [
        { label: t('links.allProducts'), href: '/shop' },
        { label: t('links.women'), href: '/shop?category=women' },
        { label: t('links.kids'), href: '/shop?category=kids' },
        { label: t('links.capsules'), href: '/shop?product_type=capsule' },
        { label: t('links.sets'), href: '/shop?product_type=set' },
      ],
    },
    {
      title: t('care'),
      links: [
        { label: t('links.sizeGuide'), href: '/size-guide' },
        { label: t('links.shipping'), href: '/policies/shipping' },
        { label: t('links.returns'), href: '/policies/returns' },
        { label: t('links.faq'), href: '/policies/faq' },
      ],
    },
    {
      title: t('about'),
      links: [
        { label: t('links.ourStory'), href: '/about' },
        { label: t('links.personas'), href: '/#stories' },
        { label: t('links.reviews'), href: '/reviews' },
        { label: t('links.contact'), href: '/policies/contact' },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-ink/10 bg-vanilla">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-serif text-2xl text-ink">easewear</p>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">{t('tagline')}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com/easewear"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 hover:bg-cream-100"
              >
                <Instagram className="h-4 w-4 text-ink" />
              </a>
              <a
                href="https://facebook.com/easewear"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 hover:bg-cream-100"
              >
                <Facebook className="h-4 w-4 text-ink" />
              </a>
              <a
                href="mailto:hello@vanilla-wear.com"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 hover:bg-cream-100"
              >
                <Mail className="h-4 w-4 text-ink" />
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-soft hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ink/10 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Easewear. {t('rights')}</p>
          <div className="flex gap-4">
            <Link href="/policies/privacy" className="hover:text-ink">{t('links.privacy')}</Link>
            <Link href="/policies/terms" className="hover:text-ink">{t('links.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
