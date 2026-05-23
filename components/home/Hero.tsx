import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative">
      <div className="container grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-clay-dark">
            Comfort-wear, made in Egypt
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
            The softest thing you&rsquo;ll wear today.
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-soft md:text-lg">
            Easewear is built for the women who do everything — and want to feel like
            themselves while doing it. Layer it, live in it, love it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="clay" size="lg">
              <Link href="/shop">Shop the collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#stories">By story</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-100 md:aspect-square">
          <Image
            src="easewear/hero/main"
            alt="Easewear hero — woman in vanilla loungewear"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
