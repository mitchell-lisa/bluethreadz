import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
import { brands, collections, products } from "@/lib/catalog";
import { SHOP_STORES } from "@/lib/stores";
import { safeShopIndex } from "@/lib/shopify/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = business.website;
  const now = new Date();
  const index = await safeShopIndex();
  const shopProducts = index?.cards ?? [];
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/quote`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    ...SHOP_STORES.map((s) => ({ url: `${base}/shop/${s.handle}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...shopProducts.map((p) => ({ url: `${base}/shop/product/${p.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...collections.map((c) => ({ url: `${base}/products/c/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...brands.map((b) => ({ url: `${base}/products/b/${b.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
