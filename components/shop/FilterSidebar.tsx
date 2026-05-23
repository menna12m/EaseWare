'use client';

import { useTranslations } from 'next-intl';
import { useRefinementList, useClearRefinements, useCurrentRefinements } from 'react-instantsearch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

// ----- Base refinement section with a custom render shape -----

type RefinementSectionProps = {
  attribute: string;
  title: string;
  layout?: 'list' | 'pills' | 'swatches';
  limit?: number;
};

function RefinementSection({ attribute, title, layout = 'list', limit = 12 }: RefinementSectionProps) {
  const { items, refine } = useRefinementList({ attribute, limit, operator: 'or' });

  if (items.length === 0) return null;

  return (
    <AccordionItem value={attribute}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        {layout === 'list' && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.label}>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.isRefined}
                    onChange={() => refine(item.value)}
                    className="h-4 w-4 rounded border-ink/30 accent-clay"
                  />
                  <span className={item.isRefined ? 'text-ink' : 'text-ink-soft'}>
                    {item.label}
                  </span>
                  <span className="ms-auto text-xs text-ink-soft">({item.count})</span>
                </label>
              </li>
            ))}
          </ul>
        )}

        {layout === 'pills' && (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => refine(item.value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  item.isRefined
                    ? 'border-clay bg-clay text-cream-50'
                    : 'border-ink/20 text-ink hover:border-ink/40'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {layout === 'swatches' && (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const hex = colorNameToHex(item.label);
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.label}
                  title={`${item.label} (${item.count})`}
                  onClick={() => refine(item.value)}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                    item.isRefined ? 'border-clay' : 'border-ink/15'
                  )}
                  style={{ backgroundColor: hex }}
                />
              );
            })}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

// Best-effort name → swatch hex. Falls back to vanilla.
function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    sand: '#E5D2A9',
    cream: '#F6F1E7',
    ivory: '#FFFFF0',
    black: '#1A1A1A',
    white: '#FFFFFF',
    rose: '#E8B4B8',
    olive: '#7C7A4A',
    clay: '#C9A27D',
    'dusty pink': '#D9A7A0',
    sage: '#9CAF88',
    navy: '#1F2D4A',
    rust: '#B4533A',
  };
  return map[name.toLowerCase()] || '#F3E9D2';
}

export function FilterSidebar() {
  const t = useTranslations('Shop');
  const { items: activeItems } = useCurrentRefinements();
  const { refine: clearAll } = useClearRefinements();
  const activeCount = activeItems.reduce((acc, group) => acc + group.refinements.length, 0);

  return (
    <aside className="w-full md:w-[280px] md:shrink-0">
      <div className="sticky top-24">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <h2 className="font-serif text-lg text-ink">{t('filters')}</h2>
          {activeCount > 0 && (
            <Button variant="link" size="sm" onClick={() => clearAll()} className="h-auto p-0 text-xs">
              {t('clearAll')} ({activeCount})
            </Button>
          )}
        </div>

        <Accordion
          type="multiple"
          defaultValue={['category', 'product_type', 'persona_tags', 'sizes', 'colors']}
          className="mt-2"
        >
          <RefinementSection attribute="category" title={t('category')} />
          <RefinementSection attribute="product_type" title={t('productType')} />
          <RefinementSection attribute="persona_tags" title={t('persona')} />
          <RefinementSection attribute="sizes" title={t('size')} layout="pills" />
          <RefinementSection attribute="colors" title={t('color')} layout="swatches" />
          <RefinementSection attribute="fabric_front" title={t('fabricFront')} />
          <RefinementSection attribute="fabric_back" title={t('fabricBack')} />
          <RefinementSection attribute="fabric_lining" title={t('fabricLining')} />
        </Accordion>
      </div>
    </aside>
  );
}

export function ActiveFilterCount() {
  const { items } = useCurrentRefinements();
  const count = items.reduce((acc, group) => acc + group.refinements.length, 0);
  if (count === 0) return null;
  return (
    <span className="ms-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1.5 text-[10px] font-medium text-cream-50">
      {count}
    </span>
  );
}
