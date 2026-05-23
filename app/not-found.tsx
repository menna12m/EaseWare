import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        That page seems to have wandered off. Let&rsquo;s get you back to something soft.
      </p>
      <Button asChild variant="clay" size="lg" className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
