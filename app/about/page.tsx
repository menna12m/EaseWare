import type { Metadata } from 'next';
import Image from 'next/image';
import { AboutSection } from './AboutSection';

// Static page — no CMS, no revalidate needed.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Our story',
  description: 'Easewear is comfort-wear designed in Egypt for every woman’s body, day, and mood.',
};

export default function AboutPage() {
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
            <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">Our story</p>
            <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              We started easewear because comfort had become a compromise.
            </h1>
            <p className="mt-5 text-ink-soft md:text-lg">
              The pieces that felt the best — modal, cotton, bamboo — were rarely the
              pieces that fit. So we started designing on real bodies in Cairo, and we
              built a brand for the days women actually live: school runs, board rooms,
              prayer mats, gym mats, plane seats, the in-between.
            </p>
          </div>
        </div>
      </AboutSection>

      <AboutSection id="vision" className="bg-vanilla py-24 text-center">
        <div className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">Vision</p>
          <p className="mt-4 font-serif text-3xl text-ink md:text-5xl">
            A world where what you wear at home is also what you want to wear out.
          </p>
        </div>
      </AboutSection>

      <AboutSection id="mission" className="container py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">Mission</p>
            <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
              Make every woman feel like herself, in every layer.
            </h2>
            <p className="mt-5 text-ink-soft">
              We size for real bodies, we stitch in Egypt, and we choose fabrics for how
              they feel after the third wash, not the first. Smaller drops, fewer
              returns, more loved pieces.
            </p>
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
          <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">Values</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">What we hold close.</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl bg-cream-50 p-6">
                <p className="font-serif text-2xl text-ink">{v.title}</p>
                <p className="mt-2 text-sm text-ink-soft">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </AboutSection>
    </div>
  );
}

const VALUES = [
  {
    title: 'Softness, always',
    body: 'Fabric chosen for the long haul, not the photograph. Modal, cotton, bamboo.',
  },
  {
    title: 'Real fit',
    body: 'Designed on five different bodies, sampled until the fit holds across them.',
  },
  {
    title: 'Local hands',
    body: 'Made in Cairo, in small runs, by people who get paid the way they should.',
  },
];
