/**
 * One-time snapshot of the blank catalog baked into the current production site.
 * bluethreadz.com no longer serves Shopify's public /products.json (the domain
 * points at this Next app), so a fresh build cannot pull the 1,600 blank styles
 * from the old feed. This reads the live pages and writes data/catalog.json.
 *
 *   node scripts/snapshot-live-catalog.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";

const ORIGIN = "https://www.bluethreadz.com";
const SITEMAP = `${ORIGIN}/sitemap.xml`;

const CATEGORIES = [
  ["tees", "T-Shirts"],
  ["hooded-sweatshirts", "Sweatshirts & Hoodies"],
  ["1-4-zips", "Quarter & Half Zips"],
  ["polos-knits", "Polos & Knits"],
  ["hats-beanies", "Hats & Beanies"],
  ["duffel-bags-backpacks", "Bags, Backpacks & Coolers"],
  ["high-visibility-workwear", "High-Visibility & Workwear"],
  ["ladies", "Women's"],
  ["youth", "Youth"],
];

function rawDecodeObject(s, start) {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return JSON.parse(s.slice(start, i + 1));
    }
  }
  throw new Error("unbalanced");
}

function extractProduct(html) {
  const re = /self\.__next_f\.push\((\[.*?\])\)<\/script>/gs;
  for (const m of html.matchAll(re)) {
    let arr;
    try {
      arr = JSON.parse(m[1]);
    } catch {
      continue;
    }
    const s = arr?.[1];
    if (typeof s !== "string") continue;
    let idx = 0;
    while (idx < s.length) {
      const i = s.indexOf('{"handle":', idx);
      if (i < 0) break;
      try {
        const obj = rawDecodeObject(s, i);
        if (obj && Array.isArray(obj.variants) && typeof obj.slug === "string" && obj.title && obj.image) {
          return obj;
        }
      } catch {
        /* keep scanning */
      }
      idx = i + 10;
    }
  }
  return null;
}

async function getText(url, tries = 4) {
  let last = "failed";
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": "bluethreadz-catalog-snapshot" } });
      if (res.ok) return await res.text();
      last = `${res.status} ${url}`;
      if (res.status === 404) return null;
    } catch (err) {
      last = err instanceof Error ? err.message : String(err);
    }
    await new Promise((r) => setTimeout(r, 400 * attempt));
  }
  throw new Error(last);
}

async function mapPool(items, size, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: size }, worker));
  return out;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const xml = await getText(SITEMAP);
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .filter((u) => /\/products\/[^/]+$/.test(new URL(u).pathname));
console.log(`sitemap product urls: ${urls.length}`);

const home = await getText(ORIGIN);
const featuredSlugs = [];
for (const m of home.matchAll(/href="\/products\/([a-z0-9-]+)"/g)) {
  if (!featuredSlugs.includes(m[1])) featuredSlugs.push(m[1]);
}
console.log(`homepage product links: ${featuredSlugs.length}`);

let done = 0;
const failed = [];
const products = (
  await mapPool(urls, 12, async (url) => {
    const html = await getText(url);
    const product = html ? extractProduct(html) : null;
    done++;
    if (done % 100 === 0 || done === urls.length) console.log(`  parsed ${done}/${urls.length}`);
    if (!product) {
      failed.push(url);
      return null;
    }
    return product;
  })
).filter(Boolean);

if (products.length < 1000) {
  throw new Error(`Only recovered ${products.length} products (${failed.length} failed). Refusing to write a partial catalog.`);
}

const bySlug = new Map(products.map((p) => [p.slug, p.handle]));
const featured = featuredSlugs.map((s) => bySlug.get(s)).filter(Boolean);

const brandCounts = new Map();
for (const p of products) brandCounts.set(p.vendor, (brandCounts.get(p.vendor) || 0) + 1);
const brands = [...brandCounts]
  .map(([name, count]) => ({ name, slug: slug(name), count }))
  .sort((a, b) => b.count - a.count);

const collections = CATEGORIES.map(([handle, name]) => ({
  slug: handle,
  name,
  count: products.filter((p) => (p.categories || []).includes(handle)).length,
}));

await mkdir("data", { recursive: true });
await writeFile(
  "data/catalog.json",
  JSON.stringify({ products, collections, brands, featured, fetchedAt: new Date().toISOString() }),
);
console.log(`wrote ${products.length} products, ${collections.length} categories, ${brands.length} brands, featured ${featured.length}`);
if (failed.length) console.log(`failed ${failed.length}:\n${failed.slice(0, 20).join("\n")}`);
