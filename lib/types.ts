// Shared domain types.

export type Money = {
  amount: number; // minor units
  currency_code: string;
};

export type ProductVariant = {
  id: string;
  title: string; // e.g. "Sand / M"
  sku?: string;
  inventory_quantity?: number;
  prices: Money[];
  options?: { value: string; option?: { title: string } }[];
};

export type ProductImage = {
  url: string;
  alt?: string;
};

export type FabricZone = {
  zone: 'Front body' | 'Back body' | 'Inner lining' | string;
  fabric: string;
  properties: string;
};

export type Product = {
  id: string;
  title: string;
  subtitle?: string | null;
  handle: string;
  description?: string | null;
  thumbnail: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options?: { title: string; values: string[] }[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  back_image?: string;
  metadata?: {
    fabric_zones?: FabricZone[];
    washing_care?: { icon: string; label: string }[];
    persona_tags?: string[];
    [k: string]: unknown;
  };
};

export type ProductCardModel = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  backImage?: string;
  price: number;
  colors?: { name: string; hex: string }[];
};

export type Review = {
  id: string;
  reviewer_name: string;
  rating: number;
  body: string;
  created_at: string;
};

export type PersonaStory = {
  slug: string;
  name: string;
  excerpt: string;
  hero_image: string;
  color_theme?: string;
  body?: string;
};

export type FAQ = {
  id: string | number;
  question: string;
  answer: string;
};
