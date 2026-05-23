'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-serif text-3xl text-ink">{t('title')}</h1>
      <p className="mt-2 max-w-md text-ink-soft">{t('body')}</p>
      <Button onClick={() => reset()} variant="clay" className="mt-6">
        {t('retry')}
      </Button>
    </div>
  );
}
