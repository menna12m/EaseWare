import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPolicyPage } from '@/lib/api/strapi';

export const dynamic = 'force-static';

const KNOWN_TYPES = ['shipping', 'returns', 'privacy', 'terms', 'faq', 'contact'] as const;
type PolicyType = (typeof KNOWN_TYPES)[number];

export function generateStaticParams() {
  return KNOWN_TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  const title = titleFor(params.type);
  return { title };
}

function titleFor(type: string) {
  const map: Record<string, string> = {
    shipping: 'Shipping',
    returns: 'Returns & exchanges',
    privacy: 'Privacy policy',
    terms: 'Terms of service',
    faq: 'FAQ',
    contact: 'Contact',
  };
  return map[type] ?? 'Policy';
}

export default async function PolicyPage({ params }: { params: { type: string } }) {
  if (!KNOWN_TYPES.includes(params.type as PolicyType)) notFound();

  const page = await getPolicyPage(params.type).catch(() => null);
  const fallback = FALLBACKS[params.type as PolicyType];

  const title = page?.title ?? titleFor(params.type);
  const body = page?.body ?? fallback;

  return (
    <article className="container max-w-2xl py-16">
      <h1 className="font-serif text-4xl text-ink md:text-5xl">{title}</h1>
      <div
        className="prose prose-stone mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </article>
  );
}

const FALLBACKS: Record<PolicyType, string> = {
  shipping: `
    <p>We ship across Egypt with our trusted local courier — usually 2–5 working days. Free shipping on orders over EGP 2,000.</p>
    <p>International orders ship via DHL Express. Duties calculated at checkout where supported.</p>
  `,
  returns: `
    <p>You have 14 days from delivery to return any unworn, tagged piece. Sale items and intimates are final sale.</p>
    <p>To start a return, email <a href="mailto:hello@vanilla-wear.com">hello@vanilla-wear.com</a> with your order number.</p>
  `,
  privacy: `
    <p>Easewear collects the minimum data needed to fulfil your order. We never sell your information. See our full policy for details on storage, cookies, and your rights.</p>
  `,
  terms: `
    <p>By using vanilla-wear.com you agree to these terms of service. All product images and copy are © Easewear.</p>
  `,
  faq: `
    <p>Common questions, answered. For anything else, message us on Instagram or email <a href="mailto:hello@vanilla-wear.com">hello@vanilla-wear.com</a>.</p>
  `,
  contact: `
    <p>Email: <a href="mailto:hello@vanilla-wear.com">hello@vanilla-wear.com</a></p>
    <p>WhatsApp: +20 100 000 0000</p>
    <p>Atelier: Maadi, Cairo — by appointment.</p>
  `,
};
