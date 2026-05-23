'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Link } from '@/lib/i18n/routing';
import type { PersonaStory } from '@/lib/types';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Static fallback so the homepage looks finished even if Strapi is empty.
const FALLBACK_STORIES: PersonaStory[] = [
  { slug: 'working-woman', name: 'The Working Woman', excerpt: 'For the boardroom and the school run.', hero_image: 'easewear/personas/working-woman' },
  { slug: 'athlete', name: 'The Athlete', excerpt: 'Built for movement, made for recovery.', hero_image: 'easewear/personas/athlete' },
  { slug: 'hijabi', name: 'The Hijabi', excerpt: 'Modest layers that breathe with you.', hero_image: 'easewear/personas/hijabi' },
  { slug: 'frequent-traveler', name: 'The Frequent Traveler', excerpt: 'Wrinkle-free, time-zone-proof.', hero_image: 'easewear/personas/traveler' },
  { slug: 'sensitive-skin', name: 'The Sensitive Skin', excerpt: 'Hypoallergenic. No tags, no fuss.', hero_image: 'easewear/personas/sensitive-skin' },
  { slug: 'mother', name: 'The Mother', excerpt: 'Soft enough for the cuddles, strong enough for the days.', hero_image: 'easewear/personas/mother' },
];

export function PersonaCardGrid({ stories }: { stories?: PersonaStory[] }) {
  const t = useTranslations('Stories');
  const data = stories && stories.length > 0 ? stories : FALLBACK_STORIES;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="stories" className="container my-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-clay">{t('eyebrow')}</p>
          <h2 className="mt-1 font-serif text-3xl text-ink md:text-4xl">{t('title')}</h2>
        </div>
      </div>

      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {data.map((story) => (
          <motion.div key={story.slug} variants={item}>
            <Link
              href={`/stories/${story.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-cream-100"
            >
              <Image
                src={story.hero_image}
                alt={story.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
                <h3 className="font-serif text-2xl">{story.name}</h3>
                <p className="mt-1 max-h-0 overflow-hidden text-sm opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-90">
                  {story.excerpt}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
