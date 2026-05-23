import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">{t('code')}</p>
      <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">{t('title')}</h1>
      <p className="mt-3 max-w-md text-ink-soft">{t('body')}</p>
      <Button asChild variant="clay" size="lg" className="mt-6">
        <Link href="/">{t('back')}</Link>
      </Button>
    </div>
  );
}
