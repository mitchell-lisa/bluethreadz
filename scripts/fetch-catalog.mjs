/**
 * Pulls the public product catalog from the existing Shopify store and writes a
 * trimmed, static JSON file the site builds from. Runs automatically before `next build`.
 *
 *   data/catalog.json   → { products, collections, brands }
 *
 * Nothing here requires a Shopify API key: /products.json and /collections/*.json are public.
 */
import { mkdir, writeFile } from "node:fs/promises";

const STORE = "https://bluethreadz.com";

// Customer-facing categories. Shopify collection handle → display name.
// Brand collections are derived from `vendor`, so they are not listed here.
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

async function getJSON(url) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    await new Promise((r) => setTimeout(r, 400));
    const res = await fetch(url, { headers: { "user-agent": "bluethreadz-site-build" } });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) {
      console.log(`  retry ${attempt} (${res.status}) ${url}`);
      await new Promise((r) => setTimeout(r, 3000 * attempt));
      continue;
    }
    throw new Error(`${res.status} ${url}`);
  }
  throw new Error(`Gave up fetching ${url}`);
}

async function getAll(path) {
  const out = [];
  for (let page = 1; page < 40; page++) {
    const data = await getJSON(`${STORE}${path}?limit=250&page=${page}`);
    out.push(...data.products);
    if (data.products.length < 250) break;
  }
  return out;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseBody(html) {
  // Shopify bodies here are: intro sentence(s) + <ul><li>feature</li>...</ul>
  const features = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
    .map((m) => stripHtml(m[1]))
    .filter(Boolean);
  const intro = stripHtml(html.replace(/<ul[\s\S]*?<\/ul>/g, ""));
  return { intro, features };
}

const raw = await getAll("/products.json");
console.log(`fetched ${raw.length} products`);

const membership = new Map(); // handle → Set(categorySlug)
for (const [handle] of CATEGORIES) {
  const items = await getAll(`/collections/${handle}/products.json`);
  for (const p of items) {
    if (!membership.has(p.handle)) membership.set(p.handle, new Set());
    membership.get(p.handle).add(handle);
  }
  console.log(`  ${handle}: ${items.length}`);
}

const products = raw
  .filter((p) => p.images.length > 0)
  .map((p) => {
    const colorOpt = p.options.find((o) => /colou?r/i.test(o.name));
    const sizeOpt = p.options.find((o) => /size/i.test(o.name));
    const colorIdx = colorOpt ? colorOpt.position : null;
    const prices = p.variants.map((v) => parseFloat(v.price)).filter((n) => !Number.isNaN(n));
    const minPrice = prices.length ? Math.min(...prices) : null;

    // color → image (first variant of that color that has a featured image)
    const colors = [];
    if (colorOpt) {
      for (const c of colorOpt.values) {
        const v = p.variants.find((v) => v[`option${colorIdx}`] === c && v.featured_image);
        colors.push({ name: c, image: v ? v.featured_image.src : null });
      }
    }
    const sizeIdx = sizeOpt ? sizeOpt.position : null;
    // Compact variant rows: [shopifyVariantId, color|null, size|null, price, available]
    const variants = p.variants.map((v) => [
      v.id,
      colorIdx ? v[`option${colorIdx}`] : null,
      sizeIdx ? v[`option${sizeIdx}`] : null,
      parseFloat(v.price),
      Boolean(v.available),
    ]);
    const { intro, features } = parseBody(p.body_html || "");
    const cleanTitle = p.title.replace(/\s*®\s*/g, " ").replace(/\s+/g, " ").trim();
    const styleMatch = cleanTitle.match(/\b([A-Z]{0,5}\d{2,6}[A-Z]{0,4})\b\.?$/);
    let title = styleMatch ? cleanTitle.slice(0, styleMatch.index) : cleanTitle;
    title = title.replace(/[\s.,-]+$/, "").trim();
    // Drop a leading brand name; the brand is shown separately.
    // Drop a leading brand name even when it's spelled differently ("Bella + Canvas" vs "BELLA+CANVAS").
    const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
    const words = title.split(/\s+/);
    for (let k = Math.min(4, words.length); k > 0; k--) {
      if (norm(words.slice(0, k).join(" ")) === norm(p.vendor)) { title = words.slice(k).join(" ").replace(/^[\s\-–]+/, ""); break; }
    }

    return {
      handle: p.handle,
      // ASCII route slug (Shopify handles contain "®", which breaks static routing)
      slug: p.handle.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/(^-|-$)/g, ""),
      title,
      vendor: p.vendor,
      brandSlug: slug(p.vendor),
      style: styleMatch ? styleMatch[1] : null,
      categories: [...(membership.get(p.handle) || [])],
      tags: p.tags,
      minPrice,
      image: p.images[0].src,
      images: p.images.slice(0, 8).map((i) => i.src),
      colors,
      sizes: sizeOpt ? sizeOpt.values : [],
      variants,
      intro,
      features,
      shopifyUrl: `${STORE}/products/${p.handle}`,
    };
  });

const featuredRaw = await getAll("/collections/featured-products/products.json");
const featured = featuredRaw.map((p) => p.handle).filter((h) => products.some((x) => x.handle === h));
console.log(`  featured: ${featured.length}`);

const brandCounts = new Map();
for (const p of products) brandCounts.set(p.vendor, (brandCounts.get(p.vendor) || 0) + 1);
const brands = [...brandCounts]
  .map(([name, count]) => ({ name, slug: slug(name), count }))
  .sort((a, b) => b.count - a.count);

const collections = CATEGORIES.map(([handle, name]) => ({
  slug: handle,
  name,
  count: products.filter((p) => p.categories.includes(handle)).length,
}));

await mkdir("data", { recursive: true });
await writeFile("data/catalog.json", JSON.stringify({ products, collections, brands, featured, fetchedAt: new Date().toISOString() }));
console.log(`wrote ${products.length} products, ${collections.length} categories, ${brands.length} brands`);
