'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Package } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import {
  getCart,
  updateCart,
  getShippingOptions,
  addShippingMethod,
  createPaymentCollection,
  initializePaymentSession,
  completeCart,
  type MedusaCart,
  type ShippingOption,
} from '@/lib/api/medusa';

type Initial = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type Step = 'idle' | 'submitting' | 'done';

export function CheckoutForm({ initial }: { initial: Initial }) {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const cartId = useCartStore((s) => s.medusaCartId);
  const clearCart = useCartStore((s) => s.clearCart);

  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [chosenOptionId, setChosenOptionId] = useState<string>('');
  const [loadingCart, setLoadingCart] = useState(true);
  const [step, setStep] = useState<Step>('idle');
  const [err, setErr] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState(initial.email);
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [phone, setPhone] = useState(initial.phone);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [province, setProvince] = useState('');

  // Hydrate cart + shipping options
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!cartId) {
        setLoadingCart(false);
        return;
      }
      try {
        const [{ cart: c }, { shipping_options }] = await Promise.all([
          getCart(cartId),
          getShippingOptions(cartId),
        ]);
        if (!alive) return;
        setCart(c);
        setShippingOptions(shipping_options ?? []);
        // Pre-pick the first option to keep checkout one-click
        if ((shipping_options ?? []).length > 0) {
          setChosenOptionId(shipping_options[0].id);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || 'Failed to load cart.');
      } finally {
        if (alive) setLoadingCart(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [cartId]);

  const subtotal = useMemo(
    () =>
      cart?.items?.reduce((acc, it) => acc + it.unit_price * it.quantity, 0) ??
      0,
    [cart]
  );
  const shippingCost = useMemo(() => {
    const opt = shippingOptions.find((o) => o.id === chosenOptionId);
    return typeof opt?.amount === 'number' ? opt.amount : 0;
  }, [shippingOptions, chosenOptionId]);
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId || !cart || cart.items.length === 0) {
      setErr(t('emptyCart'));
      return;
    }
    if (!chosenOptionId) {
      setErr(t('chooseShipping'));
      return;
    }
    setErr(null);
    setStep('submitting');

    try {
      // 1. Set email + addresses on the cart
      const address = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
        address_1: address1.trim(),
        address_2: address2.trim() || undefined,
        city: city.trim(),
        postal_code: postalCode.trim() || undefined,
        country_code: 'eg',
        province: province.trim() || undefined,
      };
      await updateCart(cartId, {
        email: email.trim(),
        shipping_address: address,
        billing_address: address,
      });

      // 2. Add the chosen shipping method
      await addShippingMethod(cartId, chosenOptionId);

      // 3. Create a payment collection and initialize a session with the
      //    system-default ("manual") provider — that's our COD path.
      const { payment_collection } = await createPaymentCollection(cartId);
      await initializePaymentSession(payment_collection.id, 'pp_system_default');

      // 4. Complete the cart → order
      const result = await completeCart(cartId);
      if (result.type !== 'order' || !result.order?.id) {
        throw new Error('Order could not be placed. Please try again.');
      }

      setStep('done');
      clearCart();
      router.push(`/orders/${result.order.id}`);
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong placing your order.');
      setStep('idle');
    }
  };

  // ── Empty cart state ────────────────────────────────────────────────────
  if (!loadingCart && (!cartId || !cart || cart.items.length === 0)) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-dashed border-ink/15 p-10 text-center">
        <Package className="mx-auto h-8 w-8 text-ink-soft" />
        <h1 className="mt-3 font-serif text-2xl text-ink">{t('emptyTitle')}</h1>
        <p className="mt-2 text-sm text-ink-soft">{t('emptyBody')}</p>
        <Button asChild variant="clay" size="lg" className="mt-6">
          <a href="/shop">{t('browseShop')}</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      {/* Form column */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <header>
          <h1 className="font-serif text-3xl text-ink md:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{t('subtitle')}</p>
        </header>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-soft">
            {t('contact')}
          </h2>
          <Input
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-3"
            autoComplete="email"
          />
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-soft">
            {t('shippingAddress')}
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Input
              placeholder={t('firstName')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />
            <Input
              placeholder={t('lastName')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
            />
            <Input
              placeholder={t('address1')}
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
              className="md:col-span-2"
              autoComplete="address-line1"
            />
            <Input
              placeholder={t('address2')}
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="md:col-span-2"
              autoComplete="address-line2"
            />
            <Input
              placeholder={t('city')}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              autoComplete="address-level2"
            />
            <Input
              placeholder={t('province')}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              autoComplete="address-level1"
            />
            <Input
              placeholder={t('postalCode')}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              autoComplete="postal-code"
            />
            <Input
              placeholder={t('phone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-soft">
            {t('shippingMethod')}
          </h2>
          <div className="mt-3 space-y-2">
            {shippingOptions.length === 0 ? (
              <p className="text-sm text-ink-soft">{t('noShippingOptions')}</p>
            ) : (
              shippingOptions.map((opt) => (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-center justify-between rounded-md border border-ink/10 p-3"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={chosenOptionId === opt.id}
                      onChange={() => setChosenOptionId(opt.id)}
                      className="h-4 w-4 accent-clay"
                    />
                    <span className="text-sm text-ink">{opt.name}</span>
                  </span>
                  {typeof opt.amount === 'number' && (
                    <span className="text-sm text-ink-soft">
                      {opt.amount} EGP
                    </span>
                  )}
                </label>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-soft">
            {t('payment')}
          </h2>
          <div className="mt-3 rounded-md border border-ink/10 bg-cream-50 p-4 text-sm text-ink-soft">
            {t('codDescription')}
          </div>
        </section>

        {err && (
          <p className="text-sm text-destructive" role="alert">
            {err}
          </p>
        )}

        <Button
          type="submit"
          variant="clay"
          size="lg"
          disabled={step !== 'idle' || loadingCart}
          className="w-full"
        >
          {step === 'submitting' ? (
            <>
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
              {t('placing')}
            </>
          ) : (
            t('placeOrder')
          )}
        </Button>
      </form>

      {/* Summary column */}
      <aside className="rounded-lg border border-ink/10 bg-cream-50 p-5 lg:sticky lg:top-24 lg:self-start">
        <h2 className="font-serif text-xl text-ink">{t('summary')}</h2>

        {loadingCart ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {cart?.items?.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-cream-100">
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-ink-soft">
                    {t('qty', { count: item.quantity })}
                  </p>
                </div>
                <span className="text-sm text-ink">
                  {item.unit_price * item.quantity} EGP
                </span>
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">{t('subtotal')}</dt>
            <dd className="text-ink">{subtotal} EGP</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">{t('shipping')}</dt>
            <dd className="text-ink">
              {shippingCost > 0 ? `${shippingCost} EGP` : t('free')}
            </dd>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-medium">
            <dt>{t('total')}</dt>
            <dd>{total} EGP</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
