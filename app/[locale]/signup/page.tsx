'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const t = useTranslations('Signup');
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirectTo') || '/account';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setErr(data?.error || 'Could not create account.');
      setBusy(false);
      return;
    }

    // Register endpoint signs us in by default; if not, route to /login.
    if (data?.signedIn === false) {
      router.push('/login');
      router.refresh();
      return;
    }

    const path = redirectTo.replace(/^\/(en|ar)/, '') || '/account';
    router.push(path);
    router.refresh();
  };

  return (
    <div className="container max-w-md py-20">
      <h1 className="font-serif text-3xl text-ink">{t('title')}</h1>
      <p className="mt-2 text-sm text-ink-soft">{t('subtitle')}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder={t('firstName')}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
          <Input
            type="text"
            placeholder={t('lastName')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
        <Input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="text-xs text-ink-soft">{t('passwordHint')}</p>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <Button
          type="submit"
          variant="clay"
          size="lg"
          disabled={busy}
          className="w-full"
        >
          {busy ? t('submitting') : t('submit')}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        {t('alreadyHave')}{' '}
        <Link href="/login" className="font-medium text-ink hover:underline">
          {t('signInInstead')}
        </Link>
      </p>
    </div>
  );
}
