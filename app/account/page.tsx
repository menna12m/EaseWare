import { AccountWishlist } from './AccountWishlist';

export const metadata = { title: 'My account' };

// Placeholder order history — real wiring lives in lib/api/medusa once we
// have a customer-id <-> Supabase user mapping.
const SAMPLE_ORDERS: { id: string; date: string; total: string; status: string }[] = [];

export default function AccountPage() {
  return (
    <div className="grid gap-12 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <h2 className="font-serif text-2xl text-ink">Order history</h2>
        {SAMPLE_ORDERS.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">You haven&rsquo;t placed an order yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/10 rounded-lg border border-ink/10">
            {SAMPLE_ORDERS.map((o) => (
              <li key={o.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-xs text-ink-soft">{o.date}</p>
                </div>
                <span className="text-sm text-ink-soft">{o.status}</span>
                <span className="font-medium">{o.total}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="wishlist">
        <h2 className="font-serif text-2xl text-ink">Wishlist</h2>
        <AccountWishlist />
      </section>
    </div>
  );
}
