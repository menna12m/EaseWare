import type { PersonaStory, FAQ } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

async function strapiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`Strapi ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// Strapi v4 returns { data: [{ id, attributes: {...} }], meta }.
// We flatten attributes for simpler consumption.
type StrapiEntity<T> = { id: number | string; attributes: T };
type StrapiResponse<T> = { data: StrapiEntity<T>[] | StrapiEntity<T> | null; meta?: unknown };

function flattenOne<T>(entity: StrapiEntity<T> | null): (T & { id: number | string }) | null {
  if (!entity) return null;
  return { id: entity.id, ...(entity.attributes as object) } as T & { id: number | string };
}

function flattenMany<T>(entities: StrapiEntity<T>[] | null | undefined): Array<T & { id: number | string }> {
  if (!entities) return [];
  return entities.map((e) => ({ id: e.id, ...(e.attributes as object) }) as T & { id: number | string });
}

// ---------- Persona Stories ----------

export async function getPersonaStories(): Promise<PersonaStory[]> {
  const res = await strapiFetch<StrapiResponse<PersonaStory>>(
    '/api/persona-stories?fields[0]=slug&fields[1]=name&fields[2]=excerpt&fields[3]=hero_image&fields[4]=color_theme',
    { next: { revalidate: 300, tags: ['stories'] } }
  );
  return flattenMany(Array.isArray(res.data) ? res.data : []);
}

export async function getPersonaStory(slug: string): Promise<PersonaStory | null> {
  const res = await strapiFetch<StrapiResponse<PersonaStory>>(
    `/api/persona-stories?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
    { next: { revalidate: 300, tags: ['stories', `story:${slug}`] } }
  );
  const arr = Array.isArray(res.data) ? res.data : [];
  return flattenOne(arr[0] ?? null);
}

// ---------- FAQs ----------

export async function getFAQsByProduct(handle: string): Promise<FAQ[]> {
  const res = await strapiFetch<StrapiResponse<FAQ>>(
    `/api/faqs?filters[product_tag][$eq]=${encodeURIComponent(handle)}`,
    { next: { revalidate: 300, tags: ['faqs', `faqs:${handle}`] } }
  );
  return flattenMany(Array.isArray(res.data) ? res.data : []);
}

// ---------- Policy pages ----------

export type PolicyPage = { type: string; title: string; body: string };

export async function getPolicyPage(type: string): Promise<PolicyPage | null> {
  const res = await strapiFetch<StrapiResponse<PolicyPage>>(
    `/api/policy-pages?filters[type][$eq]=${encodeURIComponent(type)}`,
    { next: { revalidate: 600, tags: ['policies', `policy:${type}`] } }
  );
  const arr = Array.isArray(res.data) ? res.data : [];
  return flattenOne(arr[0] ?? null);
}

// ---------- Fabric Types & Size Charts ----------

export type FabricType = {
  name: string;
  description: string;
  properties: string[];
};

export async function getFabricTypes(): Promise<FabricType[]> {
  const res = await strapiFetch<StrapiResponse<FabricType>>('/api/fabric-types', {
    next: { revalidate: 3600, tags: ['fabrics'] },
  });
  return flattenMany(Array.isArray(res.data) ? res.data : []);
}

export type SizeChart = {
  category: string;
  measurements: { size: string; bust?: number; waist?: number; hip?: number; height?: number }[];
};

export async function getSizeChart(category: string): Promise<SizeChart | null> {
  const res = await strapiFetch<StrapiResponse<SizeChart>>(
    `/api/size-charts?filters[category][$eq]=${encodeURIComponent(category)}`,
    { next: { revalidate: 3600, tags: ['size-charts'] } }
  );
  const arr = Array.isArray(res.data) ? res.data : [];
  return flattenOne(arr[0] ?? null);
}
