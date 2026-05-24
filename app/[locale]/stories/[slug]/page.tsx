import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import { HorizontalProductStrip } from '@/components/shared/HorizontalProductStrip';
import { getPersonaStories, getPersonaStory } from '@/lib/api/strapi';
import { getProductsByPersona } from '@/lib/api/medusa';
import { StrapiBlocks } from '@/components/shared/StrapiBlocks';
import type { ProductCardModel } from '@/lib/types';
import { locales } from '@/i18n';

type Params = { slug: string; locale: string };

// Cross-product of locales × slugs so both /en/stories/* and /ar/stories/* are SSG.
export async function generateStaticParams(): Promise<{ slug: string; locale: string }[]> {
  try {
    const stories = await getPersonaStories();
    return locales.flatMap((locale) => stories.map((s) => ({ slug: s.slug, locale })));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const story = await getPersonaStory(params.slug).catch(() => null);
  if (!story) return { title: 'Story not found' };
  return {
    title: story.name,
    description: story.excerpt,
    openGraph: {
      title: story.name,
      description: story.excerpt,
      images: story.hero_image ? [story.hero_image] : undefined,
    },
  };
}

export default async function StoryPage({ params }: { params: Params }) {
  unstable_setRequestLocale(params.locale);

  const story = await getPersonaStory(params.slug).catch(() => null);
  if (!story) notFound();

  const picksRes = await getProductsByPersona(params.slug).catch(() => ({ products: [] }));
  const picks: ProductCardModel[] = (picksRes.products ?? []).slice(0, 3).map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail,
    backImage: p.images?.[1]?.url,
    price: p.variants?.[0]?.prices?.[0]?.amount ?? 0,
    colors: p.colors,
  }));

  return (
    <article>
      <header className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src={story.hero_image}
          alt={story.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 container pb-12 text-cream-50">
          <h1 className="mt-2 font-serif text-5xl md:text-7xl">{story.name}</h1>
          <p className="mt-4 max-w-xl text-base md:text-lg">{story.excerpt}</p>
        </div>
      </header>

      <div className="container py-12">
        {story.body ? (
          <div className="prose prose-stone max-w-2xl">
            <StrapiBlocks blocks={story.body} />
          </div>
        ) : null}

        <div className="my-10">
          <HorizontalProductStrip title={story.name} products={picks} />
        </div>

        <div className="flex justify-center">
          <Button asChild variant="clay" size="lg">
            <Link href={`/shop?persona=${story.slug}`}>{story.name}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
