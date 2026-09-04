import catalog from "@/data/catalog.json";

export type Product = {
  handle: string;
  slug: string;
  title: string;
  vendor: string;
  brandSlug: string;
  style: string | null;
  categories: string[];
  tags: string[];
  minPrice: number | null;
  image: string;
  images: string[];
  colors: { name: string; image: string | null }[];
  sizes: string[];
  /** [variantId, color|null, size|null, price, available] */
  variants: [number, string | null, string | null, number, boolean][];
  intro: string;
  features: string[];
  shopifyUrl: string;
};

export type Collection = { slug: string; name: string; count: number };
export type Brand = { name: string; slug: string; count: number };

const data = catalog as unknown as {
  products: Product[];
  collections: Collection[];
  brands: Brand[];
  featured: string[];
  fetchedAt: string;
};

export const products = data.products;
export const collections = data.collections;
export const brands = data.brands;
export const featured = (data.featured ?? []).map((h) => products.find((p) => p.handle === h)).filter(Boolean) as Product[];

/** Lightweight shape for grids — keeps category pages small. */
export type ProductCard = Pick<Product, "handle" | "slug" | "title" | "vendor" | "brandSlug" | "style" | "minPrice" | "image"> & {
  colorCount: number;
};

export function toCard(p: Product): ProductCard {
  return {
    handle: p.handle,
    slug: p.slug,
    title: p.title,
    vendor: p.vendor,
    brandSlug: p.brandSlug,
    style: p.style,
    minPrice: p.minPrice,
    image: p.image,
    colorCount: p.colors.length,
  };
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}
export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug) ?? null;
}
export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug) ?? null;
}
export function productsInCollection(slug: string) {
  return products.filter((p) => p.categories.includes(slug));
}
export function productsByBrand(slug: string) {
  return products.filter((p) => p.brandSlug === slug);
}

/** Shopify CDN resize: insert `_600x` etc. before the file extension. */
export function img(src: string, width: number) {
  return src.replace(/(\.[a-z]+)(\?|$)/i, `_${width}x$1$2`);
}

export function money(n: number | null) {
  if (n == null) return null;
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export function categoryNames(p: Product) {
  return p.categories.map((s) => getCollection(s)?.name).filter(Boolean) as string[];
}

/** Prefer a flat-lay / product-only photo over a model shot, when the supplier provides one. */
export function flatImage(p: Product) {
  return p.images.find((i) => /flat|_hat_|_bag_|detail/i.test(i)) ?? p.images.find((i) => !/model/i.test(i)) ?? p.image;
}
export function hasFlatImage(p: Product) {
  return p.images.some((i) => /flat|_hat_|_bag_|detail/i.test(i));
}
