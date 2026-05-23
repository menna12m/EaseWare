'use client';

import { useTranslations } from 'next-intl';
import { Ruler } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const DEFAULT_CHART: { size: string; bust: string; waist: string; hip: string }[] = [
  { size: 'XS', bust: '78–82', waist: '60–64', hip: '86–90' },
  { size: 'S', bust: '83–87', waist: '65–69', hip: '91–95' },
  { size: 'M', bust: '88–93', waist: '70–75', hip: '96–101' },
  { size: 'L', bust: '94–99', waist: '76–82', hip: '102–107' },
  { size: 'XL', bust: '100–106', waist: '83–89', hip: '108–113' },
];

type Props = {
  category?: 'women' | 'kids';
  chart?: { size: string; bust?: string; waist?: string; hip?: string; height?: string }[];
};

export function SizeGuideSheet({ category = 'women', chart }: Props) {
  const t = useTranslations('SizeGuide');
  const tNav = useTranslations('Nav');
  const rows = chart ?? DEFAULT_CHART;
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center gap-1 text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
        <Ruler className="h-3.5 w-3.5" />
        {tNav('sizeGuide')}
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {tNav('sizeGuide')} — {category === 'women' ? t('women') : t('kids')}
          </SheetTitle>
          <p className="text-sm text-ink-soft">{t('intro')}</p>
        </SheetHeader>
        <div className="p-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-start">
                <th className="py-2 pe-3 font-medium text-ink">{t('headers.size')}</th>
                <th className="py-2 pe-3 font-medium text-ink">{t('headers.bust')}</th>
                <th className="py-2 pe-3 font-medium text-ink">{t('headers.waist')}</th>
                <th className="py-2 font-medium text-ink">{t('headers.hip')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.size} className="border-b border-ink/5 last:border-b-0">
                  <td className="py-2.5 pe-3 font-medium">{r.size}</td>
                  <td className="py-2.5 pe-3 text-ink-soft">{r.bust ?? '—'}</td>
                  <td className="py-2.5 pe-3 text-ink-soft">{r.waist ?? '—'}</td>
                  <td className="py-2.5 text-ink-soft">{r.hip ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 rounded-lg bg-vanilla p-4 text-sm text-ink-soft">
            <strong className="text-ink">{t('howTo.title')}:</strong> {t('howTo.bust')}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
