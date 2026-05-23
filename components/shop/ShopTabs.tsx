'use client';

import { useTranslations } from 'next-intl';
import { useRefinementList } from 'react-instantsearch';
import { Sparkles, Package, Layers, Users, Baby } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Top tabs that map to specific refinements on category/product_type/persona.
// Clicking a tab toggles the underlying refinement so Algolia stays the
// source of truth — the UI just provides a higher-level affordance.

type TabDef = {
  // i18n key under "Shop.tabs"
  labelKey: 'women' | 'kids' | 'capsules' | 'sets';
  attribute: 'category' | 'product_type';
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const TABS: TabDef[] = [
  { labelKey: 'women', attribute: 'category', value: 'women', Icon: Users },
  { labelKey: 'kids', attribute: 'category', value: 'kids', Icon: Baby },
  { labelKey: 'capsules', attribute: 'product_type', value: 'capsule', Icon: Package },
  { labelKey: 'sets', attribute: 'product_type', value: 'set', Icon: Layers },
];

function Tab({ tab }: { tab: TabDef }) {
  const t = useTranslations('Shop.tabs');
  const { items, refine } = useRefinementList({ attribute: tab.attribute });
  const matching = items.find((i) => i.value === tab.value);
  const active = !!matching?.isRefined;
  return (
    <button
      type="button"
      onClick={() => refine(tab.value)}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all',
        active
          ? 'border-clay bg-clay text-cream-50 shadow-sm'
          : 'border-ink/15 bg-cream-50 text-ink hover:border-ink/30'
      )}
    >
      <tab.Icon className="h-4 w-4" />
      {t(tab.labelKey)}
    </button>
  );
}

export function ShopTabs() {
  const t = useTranslations('Shop.tabs');
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
      {TABS.map((tab) => (
        <Tab key={tab.labelKey} tab={tab} />
      ))}
      <a
        href="/#stories"
        className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream-50 px-4 py-2 text-sm text-ink hover:border-ink/30"
      >
        <Sparkles className="h-4 w-4" />
        {t('byStory')}
      </a>
    </div>
  );
}
