import type { Metadata } from 'next';
import Image from 'next/image';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { AboutSection } from './AboutSection';
import { locales } from '@/i18n';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'About.story' });
  return { title: t('eyebrow') };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('About');

  return (
    <div>
      <AboutSection id="story" className="container py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-100">
            <Image
              src="easewear/about/story"
              alt="Easewear founders fitting samples"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">{t('story.eyebrow')}</p>
            <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">{t('story.title')}</h1>
            <p className="mt-5 text-ink-soft md:text-lg">{t('story.body')}</p>
          </div>
        </div>
      </AboutSection>

      <AboutSection id="vision" className="bg-vanilla py-24 text-center">
        <div className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">{t('vision.eyebrow')}</p>
          <p className="mt-4 font-serif text-3xl text-ink md:text-5xl">{t('vision.title')}</p>
        </div>
      </AboutSection>

      <AboutSection id="mission" className="container py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">{t('mission.eyebrow')}</p>
            <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{t('mission.title')}</h2>
            <p className="mt-5 text-ink-soft">{t('mission.body')}</p>
          </div>
          <div className="relative order-first aspect-[4/5] overflow-hidden rounded-2xl bg-cream-100 md:order-none">
            <Image
              src="easewear/about/mission"
              alt="Easewear atelier in Cairo"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </AboutSection>

      <AboutSection id="values" className="bg-cream-100 py-20">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">{t('values.eyebrow')}</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{t('values.title')}</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(['softness', 'realFit', 'localHands'] as const).map((key) => (
              <div key={key} className="rounded-2xl bg-cream-50 p-6">
                <p className="font-serif text-2xl text-ink">{t(`values.${key}.title`)}</p>
                <p className="mt-2 text-sm text-ink-soft">{t(`values.${key}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </AboutSection>
    </div>
  );
}
