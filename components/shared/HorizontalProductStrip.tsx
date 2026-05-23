import type { ProductCardModel } from '@/lib/types';
import { ProductCard } from '@/components/shared/ProductCard';

type Props = {
  title?: string;
  products: ProductCardModel[];
};

export function HorizontalProductStrip({ title, products }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="my-12">
      {title && <h2 className="container mb-6 font-serif text-2xl text-ink md:text-3xl">{title}</h2>}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
        {products.map((p) => (
          <div key={p.id} className="w-[70vw] shrink-0 snap-start sm:w-[40vw] md:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
