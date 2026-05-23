import { Leaf, Ruler, Heart } from 'lucide-react';

const VALUES = [
  {
    Icon: Leaf,
    title: 'Fabric quality',
    body: 'Modal, cotton, bamboo. Sourced for softness, tested for the long haul.',
  },
  {
    Icon: Ruler,
    title: 'Perfect fit',
    body: 'Designed on real bodies, in five sizes that actually fit five different women.',
  },
  {
    Icon: Heart,
    title: 'Conscious comfort',
    body: 'Made locally in small runs. Less waste, more pieces you reach for daily.',
  },
];

export function BrandValuesStrip() {
  return (
    <section className="bg-vanilla">
      <div className="container grid gap-8 py-16 md:grid-cols-3">
        {VALUES.map(({ Icon, title, body }) => (
          <div key={title} className="flex flex-col items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-50">
              <Icon className="h-6 w-6 text-clay-dark" />
            </span>
            <h3 className="font-serif text-xl text-ink">{title}</h3>
            <p className="text-sm leading-relaxed text-ink-soft">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
