import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { PersonaCardGrid } from '@/components/home/PersonaCardGrid';
import { BrandValuesStrip } from '@/components/home/BrandValuesStrip';
import { HorizontalProductStrip } from '@/components/shared/HorizontalProductStrip';
import { getPersonaStories } from '@/lib/api/strapi';
import { getProducts } from '@/lib/api/medusa';
import type { ProductCardModel } from '@/lib/types';

// Featured products and persona stories change rarely — 60s ISR is plenty.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Easewear — Comfort-wear for every woman',
};

async function loadHomeData() {
  // Strapi/Medusa can both be down in dev. Fail open: render with empty data.
  const [stories, productsRes] = await Promise.allSettled([
    getPersonaStories(),
    getProducts({ limit: 8, order: '-created_at' }),
  ]);

  const personaStories = stories.status === 'fulfilled' ? stories.value : [];
  const products = productsRes.status === 'fulfilled' ? productsRes.value.products : [];

  const featured: ProductCardModel[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail,
    backImage: p.images?.[1]?.url,
    price: p.variants?.[0]?.prices?.[0]?.amount ?? 0,
    colors: p.colors,
  }));

  return { personaStories, featured };
}

export default async function HomePage() {
  const { personaStories, featured } = await loadHomeData();

  return (
    <>
      <Hero />
      <PersonaCardGrid stories={personaStories} />
      {featured.length > 0 && (
        <div className="container">
          <HorizontalProductStrip title="Just dropped" products={featured} />
        </div>
      )}
      <BrandValuesStrip />
    </>
  );
}
