import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { CheckoutForm } from './CheckoutForm';
import { getCurrentCustomer } from '@/lib/medusa/session';

export const metadata: Metadata = { title: 'Checkout' };
export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const customer = await getCurrentCustomer();

  return (
    <div className="container py-10 md:py-16">
      <CheckoutForm
        initial={{
          email: customer?.email ?? '',
          firstName: customer?.first_name ?? '',
          lastName: customer?.last_name ?? '',
          phone: customer?.phone ?? '',
        }}
      />
    </div>
  );
}
