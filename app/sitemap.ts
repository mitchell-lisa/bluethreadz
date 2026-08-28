import type { MetadataRoute } from "next";
import { products, categories, brands } from "@/lib/catalog";

const BASE = "https://bluethreadz.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, priority: 1 },
    { url: `${BASE}/quote`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/products`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/how-it-works`, lastModified: now, priority: 0.7 },
    ...categories.map((c) => ({ url: `${BASE}/products/c/${c.handle}`, lastModified: now, priority: 0.6 })),
    ...brands.map((b) => ({ url: `${BASE}/products/b/${b.handle}`, lastModified: now, priority: 0.6 })),
    ...products.map((p) => ({ url: `${BASE}/products/${p.slug}`, lastModified: now, priority: 0.4 })),
  ];
}
