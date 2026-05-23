import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel';
import { FabricZoneTable } from '@/components/product/FabricZoneTable';
import { WashingCare } from '@/components/product/WashingCare';
import { ProductFAQ } from '@/components/product/ProductFAQ';
import { ReviewSection } from '@/components/product/ReviewSection';
import { HorizontalProductStrip } from '@/components/shared/HorizontalProductStrip';
import { LastViewedStrip } from '@/components/shared/LastViewedStrip';
import { getProductByHandle, getProductReviews, getProductsByPersona } from '@/lib/api/medusa';
import { getFAQsByProduct } from '@/lib/api/strapi';
import type { ProductCardModel } from '@/lib/types';

export const revalidate = 30;

type Params = { slug: string; locale: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const { product } = await getProductByHandle(params.slug);
    return {
      title: product.title,
      description: product.description ?? `Shop ${product.title} on Easewear.`,
      openGraph: {
        title: product.title,
        description: product.description ?? undefined,
        images: product.thumbnail ? [product.thumbnail] : undefined,
      },
    };
  } catch {
    return { title: 'Product not found' };
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('Product');
  let product;
  try {
    ({ product } = await getProductByHandle(params.slug));
  } catch {
    notFound();
  }
  if (!product) notFound();

  const personaTag = product.metadata?.persona_tags?.[0];

  const [reviewsRes, faqsRes, similarRes] = await Promise.allSettled([
    getProductReviews(product.id),
    getFAQsByProduct(product.handle),
    personaTag ? getProductsByPersona(personaTag) : Promise.resolve({ products: [] }),
  ]);

  const reviews = reviewsRes.status === 'fulfilled' ? reviewsRes.value.reviews : [];
  const faqs = faqsRes.status === 'fulfilled' ? faqsRes.value : [];
  const similarProducts =
    similarRes.status === 'fulfilled'
      ? similarRes.value.products
          .filter((p) => p.id !== product.id)
          .slice(0, 3)
          .map<ProductCardModel>((p) => ({
            id: p.id,
            title: p.title,
            handle: p.handle,
            thumbnail: p.thumbnail,
            backImage: p.images?.[1]?.url,
            price: p.variants?.[0]?.prices?.[0]?.amount ?? 0,
            colors: p.colors,
          }))
      : [];

  return (
    <div className="container py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images?.length > 0 ? product.images : [{ url: product.thumbnail, alt: product.title }]}
          productTitle={product.title}
        />
        <ProductPurchasePanel product={product} />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-serif text-2xl text-ink">{t('fabricZones')}</h2>
          <FabricZoneTable zones={product.metadata?.fabric_zones ?? defaultZones} />
        </div>
        <div>
          <h2 className="mb-4 font-serif text-2xl text-ink">{t('care')}</h2>
          <WashingCare instructions={product.metadata?.washing_care} />
        </div>
      </div>

      {product.description && (
        <section className="prose prose-stone mt-12 max-w-2xl">
          <p>{product.description}</p>
        </section>
      )}

      <ProductFAQ faqs={faqs} />

      <ReviewSection productId={product.id} initialReviews={reviews} />

      {similarProducts.length > 0 && (
        <HorizontalProductStrip title={t('alsoLove')} products={similarProducts} />
      )}

      <LastViewedStrip />
    </div>
  );
}

// Sensible defaults so the page renders nicely even without metadata in Medusa.
const defaultZones = [
  { zone: 'Front body', fabric: 'Modal', properties: 'Ultra-soft, moisture-wicking' },
  { zone: 'Back body', fabric: 'Cotton', properties: 'Breathable, durable' },
  { zone: 'Inner lining', fabric: 'Bamboo', properties: 'Antibacterial, hypoallergenic' },
];
