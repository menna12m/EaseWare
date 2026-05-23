'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-serif text-3xl text-ink">Something soft got tangled.</h1>
      <p className="mt-2 max-w-md text-ink-soft">
        We&rsquo;ve been notified. Try again, or head back home.
      </p>
      <Button onClick={() => reset()} variant="clay" className="mt-6">
        Try again
      </Button>
    </div>
  );
}
