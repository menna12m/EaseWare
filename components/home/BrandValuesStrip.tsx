import { useTranslations } from 'next-intl';
import { Leaf, Ruler, Heart } from 'lucide-react';

export function BrandValuesStrip() {
  const t = useTranslations('BrandValues');
  const values = [
    { Icon: Leaf, title: t('fabric.title'), body: t('fabric.body') },
    { Icon: Ruler, title: t('fit.title'), body: t('fit.body') },
    { Icon: Heart, title: t('conscious.title'), body: t('conscious.body') },
  ];
  return (
    <section className="bg-vanilla">
      <div className="container grid gap-8 py-16 md:grid-cols-3">
        {values.map(({ Icon, title, body }) => (
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
