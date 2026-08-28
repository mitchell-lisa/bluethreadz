import raw from "@/data/catalog.json";

export type Variant = {
  id: number;
  title: string;
  available: boolean;
  price: string;
  o1: string | null;
  o2: string | null;
  o3: string | null;
  img: string | null;
};

export type Product = {
  handle: string;
  slug: string;
  title: string;
  vendor: string;
  type: string;
  tags: string[];
  images: string[];
  colors: { name: string; image: string | null }[];
  sizes: string[];
  optionNames: string[];
  variants: Variant[];
};

export type Collection = { handle: string; title: string; count: number };

type Catalog = {
  fetchedAt: string;
  products: Product[];
  categories: Collection[];
  brands: Collection[];
  featured: string[];
  membership: Record<string, string[]>;
};

const catalog = raw as unknown as Catalog;

export const products = catalog.products;
export const categories = catalog.categories;
export const brands = catalog.brands;
export const membership = catalog.membership;

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byHandle = new Map(products.map((p) => [p.handle, p]));

/** Accepts either the URL slug or the raw Shopify handle. */
export function getProduct(key: string) {
  return bySlug.get(key) ?? byHandle.get(key) ?? null;
}

export function productsIn(collectionHandle: string): Product[] {
  const handles = membership[collectionHandle] ?? [];
  return handles.map((h) => byHandle.get(h)).filter(Boolean) as Product[];
}

export function featured(limit = 8): Product[] {
  const picked = catalog.featured
    .map((h) => byHandle.get(h))
    .filter((p): p is Product => Boolean(p) && (p as Product).images.length > 0);
  return picked.slice(0, limit);
}

export function collectionOf(handle: string): Collection | null {
  return (
    categories.find((c) => c.handle === handle) ??
    brands.find((c) => c.handle === handle) ??
    null
  );
}

/** Cleans up the long supplier-style titles for display. */
export function displayTitle(p: Product) {
  return p.title.replace(/\s*®\s*/g, "\u00ae ").replace(/\s+/g, " ").trim();
}

/** Slim payload handed to client components (search, studio). */
export type LiteProduct = {
  h: string;
  t: string;
  v: string;
  img: string;
};

export function liteIndex(): LiteProduct[] {
  return products
    .filter((p) => p.images.length > 0)
    .map((p) => ({ h: p.slug, t: displayTitle(p), v: p.vendor, img: p.images[0] }));
}

export const catalogSize = products.length;
export const brandCount = brands.length;
export const categoryCount = categories.length;
