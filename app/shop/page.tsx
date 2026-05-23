import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopProvider } from '@/components/shop/ShopProvider';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ShopTabs } from '@/components/shop/ShopTabs';
import { MobileFilterButton } from '@/components/shop/MobileFilterButton';
import { ALGOLIA_INDEX } from '@/components/shop/ShopProvider';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse the full Easewear collection — capsules, sets, and stories for every woman.',
};

// SSR + streaming. Algolia handles client filtering, so the server just needs
// to render the shell quickly. The grid streams in once Algolia responds.
export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

// Build the InstantSearch UI state from server-side ?category=women etc., so
// deep links and SSR start with the right facet selections.
function uiStateFromQuery(params: SearchParams) {
  const refinementList: Record<string, string[]> = {};
  const pick = (key: string) => {
    const v = params[key];
    if (!v) return;
    refinementList[key] = Array.isArray(v) ? v : [v];
  };
  pick('category');
  pick('product_type');
  pick('persona');

  // Algolia attribute names differ slightly from our friendly URL keys.
  const remapped: Record<string, string[]> = {};
  if (refinementList.category) remapped.category = refinementList.category;
  if (refinementList.product_type) remapped.product_type = refinementList.product_type;
  if (refinementList.persona) remapped.persona_tags = refinementList.persona;

  return { [ALGOLIA_INDEX]: { refinementList: remapped } };
}

export default function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const initialUiState = uiStateFromQuery(searchParams);

  return (
    <ShopProvider initialUiState={initialUiState}>
      <div className="container py-8">
        <header className="mb-6">
          <h1 className="font-serif text-3xl text-ink md:text-4xl">The shop</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Filter by story, fabric, fit. Everything in stock, ships from Cairo.
          </p>
        </header>

        <div className="mb-6 flex items-center justify-between gap-3">
          <ShopTabs />
          <MobileFilterButton />
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="hidden md:block">
            <FilterSidebar />
          </div>
          <Suspense fallback={<div className="flex-1 text-sm text-ink-soft">Loading…</div>}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </ShopProvider>
  );
}
