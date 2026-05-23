import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Size guide',
  description: 'Find your easewear fit across women’s and kids’ sizing. All measurements in centimeters.',
};

const WOMEN = [
  { size: 'XS', bust: '78–82', waist: '60–64', hip: '86–90' },
  { size: 'S', bust: '83–87', waist: '65–69', hip: '91–95' },
  { size: 'M', bust: '88–93', waist: '70–75', hip: '96–101' },
  { size: 'L', bust: '94–99', waist: '76–82', hip: '102–107' },
  { size: 'XL', bust: '100–106', waist: '83–89', hip: '108–113' },
];

const KIDS = [
  { size: '2–3Y', chest: '54–56', height: '92–98' },
  { size: '4–5Y', chest: '57–59', height: '104–110' },
  { size: '6–7Y', chest: '60–62', height: '116–122' },
  { size: '8–9Y', chest: '64–66', height: '128–134' },
  { size: '10–11Y', chest: '68–72', height: '140–146' },
];

export default function SizeGuidePage() {
  return (
    <div className="container max-w-3xl py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">Size guide</p>
        <h1 className="mt-2 font-serif text-4xl text-ink md:text-5xl">Find your easewear fit.</h1>
        <p className="mt-4 text-ink-soft">
          Our sizing is true and slightly generous through the waist. If you&rsquo;re
          between sizes, size down for fitted pieces (capsules) and up for relaxed sets.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="font-serif text-2xl text-ink">Women</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-vanilla text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Bust</th>
                <th className="px-4 py-3 font-medium">Waist</th>
                <th className="px-4 py-3 font-medium">Hip</th>
              </tr>
            </thead>
            <tbody>
              {WOMEN.map((r) => (
                <tr key={r.size} className="border-t border-ink/10">
                  <td className="px-4 py-3 font-medium">{r.size}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.bust}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.waist}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl text-ink">Kids</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-vanilla text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Chest</th>
                <th className="px-4 py-3 font-medium">Height</th>
              </tr>
            </thead>
            <tbody>
              {KIDS.map((r) => (
                <tr key={r.size} className="border-t border-ink/10">
                  <td className="px-4 py-3 font-medium">{r.size}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.chest}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl bg-vanilla p-6">
        <h3 className="font-serif text-xl text-ink">How to measure</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li><strong className="text-ink">Bust:</strong> around the fullest part, keeping the tape level.</li>
          <li><strong className="text-ink">Waist:</strong> the narrowest point, usually above the navel.</li>
          <li><strong className="text-ink">Hip:</strong> around the widest part, about 20 cm below the waist.</li>
        </ul>
      </section>
    </div>
  );
}
