import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
import { brands, collections, products } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.website;
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/quote`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    ...collections.map((c) => ({ url: `${base}/products/c/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...brands.map((b) => ({ url: `${base}/products/b/${b.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
