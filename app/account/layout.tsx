import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

// Middleware already redirects unauthenticated visitors away from /account/*,
// but we double-check here for defense in depth (and to surface user email).
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect('/login?redirectTo=/account');
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirectTo=/account');

  return (
    <div className="container py-12">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-clay-dark">My account</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Welcome back, {user.email?.split('@')[0]}.</h1>
        </div>
        <nav className="flex gap-4 text-sm text-ink-soft">
          <Link href="/account" className="hover:text-ink">Orders</Link>
          <Link href="/account#wishlist" className="hover:text-ink">Wishlist</Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="hover:text-ink">Sign out</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
