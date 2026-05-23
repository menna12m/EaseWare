import type { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { PersonaCardGrid } from '@/components/home/PersonaCardGrid';
import { BrandValuesStrip } from '@/components/home/BrandValuesStrip';
import { HorizontalProductStrip } from '@/components/shared/HorizontalProductStrip';
import { getPersonaStories, getHomePage } from '@/lib/api/strapi';
import { getProducts } from '@/lib/api/medusa';
import type { ProductCardModel } from '@/lib/types';

// Featured products and persona stories change rarely — 60s ISR is plenty.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Easewear — Comfort-wear for every woman',
};

async function loadHomeData(locale: string) {
  // Strapi/Medusa can both be down in dev. Fail open: render with empty data.
  const [stories, productsRes, homePage] = await Promise.allSettled([
    getPersonaStories(),
    getProducts({ limit: 8, order: '-created_at' }),
    getHomePage(locale),
  ]);

  const personaStories = stories.status === 'fulfilled' ? stories.value : [];
  const products = productsRes.status === 'fulfilled' ? productsRes.value.products : [];
  const home = homePage.status === 'fulfilled' ? homePage.value : null;

  const featured: ProductCardModel[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail,
    backImage: p.images?.[1]?.url,
    price: p.variants?.[0]?.prices?.[0]?.amount ?? 0,
    colors: p.colors,
  }));

  return { personaStories, featured, home };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Featured');
  const { personaStories, featured, home } = await loadHomeData(locale);

  return (
    <>
      <Hero
        imageUrl={home?.hero_image ?? null}
        imageAlt={home?.hero_image_alt ?? null}
        eyebrow={home?.hero_eyebrow ?? null}
        title={home?.hero_title ?? null}
        body={home?.hero_body ?? null}
        shopCta={home?.hero_shop_cta ?? null}
        storyCta={home?.hero_story_cta ?? null}
      />
      <PersonaCardGrid stories={personaStories} />
      {featured.length > 0 && (
        <div className="container">
          <HorizontalProductStrip title={t('title')} products={featured} />
        </div>
      )}
      <BrandValuesStrip />
    </>
  );
}
