import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';

export function Hero() {
  const t = useTranslations('Hero');
  return (
    <section className="relative">
      <div className="container grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-clay-dark">
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-soft md:text-lg">{t('body')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="clay" size="lg">
              <Link href="/shop">{t('shopCta')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={{ pathname: '/', hash: 'stories' }}>{t('storyCta')}</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-100 md:aspect-square">
          <Image
            src="easewear/hero/main"
            alt="Easewear hero — woman in vanilla loungewear"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
