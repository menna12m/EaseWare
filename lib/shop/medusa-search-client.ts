import { MEDUSA_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/medusa/client';

/**
 * Medusa-backed search client for react-instantsearch.
 *
 * Implements the same `search(requests)` shape that algoliasearch's lite
 * client exposes, so the existing <FilterSidebar> and <ProductGrid> widgets
 * keep working unchanged. We do the filtering + faceting in memory because
 * the catalogue is small (~tens of products); for a bigger catalogue, push
 * to Algolia and swap this client back out.
 */

type Money = { amount: number; currency_code: string };

type Variant = {
  id: string;
  prices?: Money[];
  options?: { value: string; option?: { title: string } }[];
};

type MedusaProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  metadata?: Record<string, any> | null;
  variants?: Variant[];
};

type Hit = {
  objectID: string;
  title: string;
  handle: string;
  thumbnail: string;
  price: number;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  category?: string;
  product_type?: string;
  persona_tags?: string[];
  fabric_front?: string;
  fabric_back?: string;
  fabric_lining?: string;
};

type AlgoliaRequest = {
  indexName: string;
  query?: string;
  params?: string | Record<string, unknown>;
};

// Lives in the browser memory — Medusa can't bust it via webhook the way it
// busts the Next.js server cache. Keep it short so edits show up fast.
const CACHE_TTL_MS = 5_000;
let cachedHits: Hit[] | null = null;
let cachedAt = 0;
let inflight: Promise<Hit[]> | null = null;

function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    ivory: '#FFFFF0',
    blush: '#E8B4B8',
    sage: '#9CAF88',
    charcoal: '#3A3A3A',
    black: '#1A1A1A',
    sand: '#E5D2A9',
    cream: '#F6F1E7',
    olive: '#7C7A4A',
    clay: '#C9A27D',
    navy: '#1F2D4A',
    rust: '#B4533A',
    white: '#FFFFFF',
  };
  return map[name.toLowerCase()] ?? '#F3E9D2';
}

function toHit(p: MedusaProduct): Hit {
  const variants = p.variants ?? [];
  const meta = p.metadata ?? {};

  const colorSet = new Set<string>();
  const sizeSet = new Set<string>();
  const prices: number[] = [];

  for (const v of variants) {
    for (const opt of v.options ?? []) {
      const title = (opt.option?.title || '').toLowerCase();
      if (!opt.value) continue;
      if (title === 'color') colorSet.add(opt.value);
      if (title === 'size') sizeSet.add(opt.value);
    }
    const egp = (v.prices ?? []).find((p) => p.currency_code?.toLowerCase() === 'egp');
    if (egp) prices.push(egp.amount);
  }

  return {
    objectID: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail ?? '',
    price: prices.length ? Math.min(...prices) : 0,
    colors: Array.from(colorSet).map((name) => ({ name, hex: colorNameToHex(name) })),
    sizes: Array.from(sizeSet),
    category: meta.category,
    product_type: meta.product_type,
    persona_tags: Array.isArray(meta.persona_tags) ? meta.persona_tags : [],
    fabric_front: meta.fabric_front,
    fabric_back: meta.fabric_back,
    fabric_lining: meta.fabric_lining,
  };
}

async function fetchAllHits(): Promise<Hit[]> {
  const now = Date.now();
  if (cachedHits && now - cachedAt < CACHE_TTL_MS) return cachedHits;
  if (inflight) return inflight;

  inflight = (async () => {
    // Medusa's default response strips metadata + nested variant option names —
    // we need both for our facets. The `fields` param lets us opt back in.
    const fields = [
      'id',
      'title',
      'handle',
      'thumbnail',
      'metadata',
      'variants.id',
      'variants.prices.amount',
      'variants.prices.currency_code',
      'variants.options.value',
      'variants.options.option.title',
    ].join(',');
    const res = await fetch(
      `${MEDUSA_URL}/store/products?limit=200&fields=${encodeURIComponent(fields)}`,
      { headers: { 'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY } }
    );
    if (!res.ok) {
      throw new Error(`Medusa /store/products failed: ${res.status}`);
    }
    const data = (await res.json()) as { products: MedusaProduct[] };
    const hits = (data.products ?? []).map(toHit);
    cachedHits = hits;
    cachedAt = Date.now();
    return hits;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

// ── Params + facet filter parsing ───────────────────────────────────────────

function parseParams(raw: AlgoliaRequest['params']): URLSearchParams {
  if (!raw) return new URLSearchParams();
  if (typeof raw === 'string') return new URLSearchParams(raw);
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(raw)) {
    if (v !== undefined) out.set(k, typeof v === 'string' ? v : JSON.stringify(v));
  }
  return out;
}

// Algolia encodes facetFilters as a JSON nested array:
//   [["category:women"], ["sizes:M", "sizes:L"]]
// Outer array = AND; inner array = OR.
function parseFacetFilters(value: string | null): Array<Array<{ attr: string; val: string }>> {
  if (!value) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((group) => {
      const arr = Array.isArray(group) ? group : [group];
      return arr
        .map((entry): { attr: string; val: string } | null => {
          if (typeof entry !== 'string') return null;
          const idx = entry.indexOf(':');
          if (idx === -1) return null;
          return { attr: entry.slice(0, idx), val: entry.slice(idx + 1) };
        })
        .filter((x): x is { attr: string; val: string } => x !== null);
    })
    .filter((g) => g.length > 0);
}

function hitMatchesAttr(hit: Hit, attr: string, val: string): boolean {
  const raw = (hit as any)[attr];
  if (Array.isArray(raw)) return raw.includes(val);
  return raw === val;
}

function applyFilters(
  all: Hit[],
  query: string,
  filterGroups: Array<Array<{ attr: string; val: string }>>
): Hit[] {
  const q = query.trim().toLowerCase();
  return all.filter((hit) => {
    if (q && !hit.title.toLowerCase().includes(q) && !hit.handle.toLowerCase().includes(q)) {
      return false;
    }
    for (const group of filterGroups) {
      const anyMatch = group.some((f) => hitMatchesAttr(hit, f.attr, f.val));
      if (!anyMatch) return false;
    }
    return true;
  });
}

// ── Facet counting ──────────────────────────────────────────────────────────
// Algolia returns per-attribute counts that exclude the currently-selected
// values of THAT attribute, so the user can see other options within the
// same facet. We replicate that "disjunctive faceting" behaviour.

function countFacets(
  all: Hit[],
  query: string,
  filterGroups: Array<Array<{ attr: string; val: string }>>,
  facetAttrs: string[]
): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};

  for (const attr of facetAttrs) {
    const otherGroups = filterGroups.filter((g) => !g.some((f) => f.attr === attr));
    const matching = applyFilters(all, query, otherGroups);

    const counts: Record<string, number> = {};
    for (const hit of matching) {
      const raw = (hit as any)[attr];
      const vals: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
      for (const v of vals) {
        counts[v] = (counts[v] ?? 0) + 1;
      }
    }
    out[attr] = counts;
  }

  return out;
}

// ── The client itself ───────────────────────────────────────────────────────

export const medusaSearchClient = {
  async search(requests: AlgoliaRequest[]) {
    const all = await fetchAllHits().catch((err) => {
      if (typeof window !== 'undefined') {
        console.error('[medusa-search] failed to fetch products:', err);
      }
      return [] as Hit[];
    });

    const results = requests.map((req) => {
      const params = parseParams(req.params);
      const query = (req.query ?? params.get('query') ?? '').toString();
      const page = Number(params.get('page') ?? 0);
      const hitsPerPage = Number(params.get('hitsPerPage') ?? 24);

      const facetFilters = parseFacetFilters(params.get('facetFilters'));
      const requestedFacets: string[] = (() => {
        const raw = params.get('facets');
        if (!raw) return [];
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [String(parsed)];
        } catch {
          return raw.split(',').filter(Boolean);
        }
      })();

      const filtered = applyFilters(all, query, facetFilters);

      const start = page * hitsPerPage;
      const paginated = filtered.slice(start, start + hitsPerPage);

      const facets = countFacets(all, query, facetFilters, requestedFacets);

      return {
        hits: paginated,
        nbHits: filtered.length,
        page,
        nbPages: Math.max(1, Math.ceil(filtered.length / hitsPerPage)),
        hitsPerPage,
        processingTimeMS: 0,
        exhaustiveNbHits: true,
        query,
        params: typeof req.params === 'string' ? req.params : '',
        facets,
        index: req.indexName,
      };
    });

    return { results };
  },

  searchForFacetValues() {
    return Promise.resolve([]);
  },
};

export type MedusaSearchClient = typeof medusaSearchClient;
