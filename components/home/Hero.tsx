import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';

type HeroProps = {
  /** Absolute URL of the hero image — typically from Strapi. */
  imageUrl?: string | null;
  imageAlt?: string | null;
  /** Strapi-driven copy. When a field is null/empty, falls back to the
   *  matching key under `messages/<locale>.json` → `"Hero.*"`. */
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  shopCta?: string | null;
  storyCta?: string | null;
};

export function Hero(props: HeroProps = {}) {
  const t = useTranslations('Hero');

  const eyebrow = props.eyebrow || t('eyebrow');
  const title = props.title || t('title');
  const body = props.body || t('body');
  const shopCta = props.shopCta || t('shopCta');
  const storyCta = props.storyCta || t('storyCta');
  const src = props.imageUrl || '/placeholder.svg';

  return (
    <section className="relative">
      <div className="container grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-clay-dark">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-soft md:text-lg">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="clay" size="lg">
              <Link href="/shop">{shopCta}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={{ pathname: '/', hash: 'stories' }}>{storyCta}</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-100 md:aspect-square">
          <Image
            src={src}
            alt={props.imageAlt || 'Easewear hero — woman in vanilla loungewear'}
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
