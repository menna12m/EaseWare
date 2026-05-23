'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirectTo') || '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setErr('Auth is not configured yet. Add Supabase credentials to .env.local.');
      return;
    }
    setBusy(true);
    setErr(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="container max-w-md py-20">
      <h1 className="font-serif text-3xl text-ink">Welcome back.</h1>
      <p className="mt-2 text-sm text-ink-soft">Sign in to track orders and your wishlist.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <Button type="submit" variant="clay" size="lg" disabled={busy} className="w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        New here?{' '}
        <Link href="/signup" className="font-medium text-ink hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
