'use client';

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
  const rows = chart ?? DEFAULT_CHART;
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center gap-1 text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
        <Ruler className="h-3.5 w-3.5" />
        Size guide
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Size guide — {category === 'women' ? 'Women' : 'Kids'}</SheetTitle>
          <p className="text-sm text-ink-soft">All measurements in centimeters. If in doubt, size up — easewear runs true.</p>
        </SheetHeader>
        <div className="p-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left">
                <th className="py-2 pr-3 font-medium text-ink">Size</th>
                <th className="py-2 pr-3 font-medium text-ink">Bust</th>
                <th className="py-2 pr-3 font-medium text-ink">Waist</th>
                <th className="py-2 font-medium text-ink">Hip</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.size} className="border-b border-ink/5 last:border-b-0">
                  <td className="py-2.5 pr-3 font-medium">{r.size}</td>
                  <td className="py-2.5 pr-3 text-ink-soft">{r.bust ?? '—'}</td>
                  <td className="py-2.5 pr-3 text-ink-soft">{r.waist ?? '—'}</td>
                  <td className="py-2.5 text-ink-soft">{r.hip ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 rounded-lg bg-vanilla p-4 text-sm text-ink-soft">
            <strong className="text-ink">How to measure:</strong> wrap a soft tape around
            the fullest part of your bust, the narrowest part of your waist, and the
            widest part of your hips. Keep the tape level and snug, not tight.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
