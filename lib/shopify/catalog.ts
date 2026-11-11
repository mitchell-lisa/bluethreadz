import { unstable_cache } from "next/cache";
import { CUSTOM_STORE, storeByHandle, TEAM_HANDLES, TEAM_STORES } from "@/lib/stores";
import { storefront } from "./client";
import type { ShopCard, ShopIndex, ShopProduct, ShopVariant } from "./types";

export type { ShopCard, ShopIndex, ShopProduct, ShopVariant };

type Money = { amount: string; currencyCode: string };
type Image = { url: string; altText: string | null } | null;

type RawCard = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  availableForSale: boolean;
  featuredImage: Image;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  collections: { nodes: { handle: string }[] };
};

const PRODUCTS_QUERY = /* GraphQL */ `
  query ShopProducts($cursor: String) {
    products(first: 100, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        handle
        title
        vendor
        productType
        availableForSale
        featuredImage { url altText }
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        collections(first: 10) { nodes { handle } }
      }
    }
  }
`;

const PRODUCT_QUERY = /* GraphQL */ `
  query ShopProduct($handle: String!, $cursor: String) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      vendor
      productType
      availableForSale
      featuredImage { url altText }
      images(first: 16) { nodes { url altText } }
      options { name values }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      collections(first: 10) { nodes { handle title } }
      variants(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          title
          availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText }
        }
      }
    }
  }
`;

export function toShopSlug(handle: string) {
  const slug = handle
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

function assignSlugs(handles: string[]) {
  const used = new Set<string>();
  const out = new Map<string, string>();
  for (const handle of [...handles].sort()) {
    const base = toShopSlug(handle);
    let slug = base;
    let n = 2;
    while (used.has(slug)) slug = `${base}-${n++}`;
    used.add(slug);
    out.set(handle, slug);
  }
  return out;
}

function toCard(node: RawCard, slug: string): ShopCard {
  return {
    id: node.id,
    handle: node.handle,
    slug,
    title: node.title.replace(/\s+/g, " ").trim(),
    vendor: node.vendor,
    productType: node.productType,
    image: node.featuredImage?.url ?? null,
    imageAlt: node.featuredImage?.altText ?? null,
    minPrice: node.priceRange.minVariantPrice.amount,
    maxPrice: node.priceRange.maxVariantPrice.amount,
    currency: node.priceRange.minVariantPrice.currencyCode,
    available: node.availableForSale,
  };
}

async function loadIndex(): Promise<ShopIndex> {
  const nodes: RawCard[] = [];
  let cursor: string | null = null;
  do {
    const data: { products: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: RawCard[] } } =
      await storefront(PRODUCTS_QUERY, { cursor });
    nodes.push(...data.products.nodes);
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (cursor);

  const slugs = assignSlugs(nodes.map((n) => n.handle));
  const cards = nodes.map((n) => toCard(n, slugs.get(n.handle)!));
  const bySlug: Record<string, string> = {};
  for (const card of cards) bySlug[card.slug] = card.handle;

  const byStore: Record<string, string[]> = {};
  for (const store of TEAM_STORES) byStore[store.handle] = [];
  const custom: string[] = [];

  nodes.forEach((node, i) => {
    const slug = cards[i].slug;
    const membership = node.collections.nodes.map((c) => c.handle).filter((h) => TEAM_HANDLES.has(h));
    if (membership.length === 0) custom.push(slug);
    for (const handle of membership) byStore[handle].push(slug);
  });

  return { cards, bySlug, byStore, custom };
}

export const getShopIndex = unstable_cache(loadIndex, ["shop-index-v3"], { revalidate: 3600 });

export async function safeShopIndex() {
  try {
    return await getShopIndex();
  } catch (err) {
    console.error("Shopify catalog unavailable", err);
    return null;
  }
}

export function cardBySlug(index: ShopIndex, slug: string) {
  const handle = index.bySlug[slug];
  if (!handle) return null;
  return index.cards.find((c) => c.handle === handle) ?? null;
}

export function cardsForStore(index: ShopIndex, storeHandle: string) {
  const slugs = storeHandle === CUSTOM_STORE.handle ? index.custom : index.byStore[storeHandle] ?? [];
  const bySlug = new Map(index.cards.map((c) => [c.slug, c]));
  return slugs.map((s) => bySlug.get(s)).filter((c): c is ShopCard => Boolean(c));
}

export function storeCounts(index: ShopIndex) {
  const counts: Record<string, number> = {};
  for (const store of TEAM_STORES) counts[store.handle] = index.byStore[store.handle]?.length ?? 0;
  counts[CUSTOM_STORE.handle] = index.custom.length;
  return counts;
}

export function storeForCard(index: ShopIndex, slug: string) {
  for (const store of TEAM_STORES) {
    if (index.byStore[store.handle]?.includes(slug)) return store;
  }
  if (index.custom.includes(slug)) return CUSTOM_STORE;
  return null;
}

type RawVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string }[];
  image: Image;
};

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  availableForSale: boolean;
  featuredImage: Image;
  images: { nodes: { url: string; altText: string | null }[] };
  options: { name: string; values: string[] }[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  collections: { nodes: { handle: string; title: string }[] };
  variants: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: RawVariant[] };
};

async function loadProduct(handle: string): Promise<ShopProduct | null> {
  const variants: RawVariant[] = [];
  let cursor: string | null = null;
  let product: RawProduct | null = null;
  do {
    const data: { product: RawProduct | null } = await storefront(PRODUCT_QUERY, { handle, cursor });
    if (!data.product) return null;
    product = data.product;
    variants.push(...data.product.variants.nodes);
    cursor = data.product.variants.pageInfo.hasNextPage ? data.product.variants.pageInfo.endCursor : null;
  } while (cursor);

  if (!product) return null;
  const index = await getShopIndex();
  const slug = index.bySlug[product.handle] ?? toShopSlug(product.handle);
  const store = storeForCard(index, slug) ?? storeByHandle(
    product.collections.nodes.find((c) => TEAM_HANDLES.has(c.handle))?.handle ?? "",
  );

  const images = product.images.nodes.map((img) => ({ url: img.url, alt: img.altText }));
  if (images.length === 0 && product.featuredImage) {
    images.push({ url: product.featuredImage.url, alt: product.featuredImage.altText });
  }

  return {
    id: product.id,
    handle: product.handle,
    slug,
    title: product.title.replace(/\s+/g, " ").trim(),
    vendor: product.vendor,
    productType: product.productType,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    available: product.availableForSale,
    images,
    options: product.options,
    variants: variants.map((v) => ({
      id: v.id,
      title: v.title,
      available: v.availableForSale,
      price: v.price.amount,
      currency: v.price.currencyCode,
      options: v.selectedOptions,
      image: v.image?.url ?? null,
      imageAlt: v.image?.altText ?? null,
    })),
    minPrice: product.priceRange.minVariantPrice.amount,
    maxPrice: product.priceRange.maxVariantPrice.amount,
    currency: product.priceRange.minVariantPrice.currencyCode,
    storeHandle: store?.handle ?? null,
    storeName: store?.name ?? null,
  };
}

export const getShopProduct = unstable_cache(
  async (handle: string) => loadProduct(handle),
  ["shop-product-v3"],
  { revalidate: 3600 },
);

