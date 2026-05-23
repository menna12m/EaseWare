# Easewear

E-commerce storefront for **Easewear** — comfort-wear for every woman, made in Egypt.

## Stack

- **Next.js 14** (App Router) · TypeScript
- **TailwindCSS** v3 + **shadcn/ui** (Radix primitives)
- **Framer Motion** — page transitions, scroll reveals, logo entrance
- **Zustand** — cart, wishlist, last-viewed (persisted to localStorage)
- **Swiper React** — product gallery (zoom, thumbnails)
- **react-instantsearch** + **Algolia** — faceted shop filtering
- **Medusa** — products, variants, carts, reviews (custom route)
- **Strapi** — persona stories, FAQs, policy pages, size charts
- **Cloudinary** — images via a custom `next/image` loader (auto WebP/AVIF)
- **Supabase** (`@supabase/ssr`) — customer auth, middleware-protected `/account`

## Getting started

```bash
cp .env.local.example .env.local   # fill in placeholders
npm install
npm run dev
```

## Rendering strategy

| Route | Mode | Notes |
| --- | --- | --- |
| `/` | SSR, `revalidate = 60` | Featured products + persona stories |
| `/shop` | SSR shell + streaming grid | Algolia handles client filtering |
| `/products/[slug]` | SSR, `revalidate = 30` | Price/stock-sensitive |
| `/stories/[slug]` | SSG via `generateStaticParams` | On-demand revalidate via `/api/revalidate` |
| `/about`, `/size-guide`, `/policies/[type]` | SSG | Static |
| `/reviews` | SSR, `revalidate = 60` | Aggregates Medusa reviews |
| `/account/**` | Dynamic, gated by middleware | Requires Supabase session |

## On-demand revalidation

Strapi (or any CMS) can POST to `/api/revalidate` to invalidate ISR pages:

```bash
curl -X POST https://vanilla-wear.com/api/revalidate \
  -H 'content-type: application/json' \
  -d '{"secret":"…","tags":["stories","story:working-woman"]}'
```

## Performance

- All product images use `next/image` with explicit `fill` + `sizes` and a Cloudinary loader (`f_auto,q_auto`).
- First-fold imagery uses `priority` to set `fetchpriority="high"`.
- Fonts (`Inter`, `Fraunces`) load via `next/font/google` with `display: 'swap'`.
- Each route has a `loading.tsx` skeleton — no blank flash.
- `experimental.optimizePackageImports` keeps Framer Motion / Swiper / Lucide tree-shaken.
- `<head>` preconnects to Cloudinary and Algolia.
