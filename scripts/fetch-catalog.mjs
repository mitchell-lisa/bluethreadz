// Pulls the live BlueThreadz Shopify catalog at build time.
// Public JSON feeds only — no API keys, no auth.
import fs from "node:fs";
import path from "node:path";

const SHOP = "https://bluethreadz.com";

const BRAND_HANDLES = new Set([
  "a4", "american-apparel", "bella-canvas", "carhartt", "champion",
  "cornerstone", "district", "eddie-bauer", "gildan", "hanes",
  "mercer-mettle", "new-era", "next-level", "next-level-apparel", "nike",
  "ogio", "port-company", "port-authority", "sport-tek",
  "the-north-face-company", "travismathew",
]);

// Categories we surface in navigation, in the order they appear.
const CATEGORY_ORDER = [
  "tees", "hooded-sweatshirts", "polos-knits", "1-4-zips", "hats-beanies",
  "duffel-bags-backpacks", "backpacks", "just-duffels", "ladies", "youth",
  "high-visibility-workwear", "coolers", "tumblers-bottles-mugs",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CACHE = path.join(process.cwd(), ".catalog-cache");
fs.mkdirSync(CACHE, { recursive: true });
const cacheKey = (u) => path.join(CACHE, u.replace(/[^a-z0-9]+/gi, "_").slice(-120) + ".json");

async function getJSON(url, tries = 10) {
  const ck = cacheKey(url);
  if (fs.existsSync(ck)) {
    try { return JSON.parse(fs.readFileSync(ck, "utf8")); } catch {}
  }
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; BlueThreadzSiteBuild/1.0)",
          accept: "application/json",
        },
      });
      if (r.ok) {
        const j = await r.json();
        fs.writeFileSync(ck, JSON.stringify(j));
        return j;
      }
    } catch {}
    await sleep(2000 * (i + 1));
  }
  throw new Error("Failed to fetch " + url);
}

/** Shopify handles can contain characters like ® that break static routes. */
function toSlug(handle) {
  return handle
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slimProduct(p) {
  const colorIdx = p.options.findIndex((o) => /colou?r/i.test(o.name));
  const sizeIdx = p.options.findIndex((o) => /size/i.test(o.name));
  const key = (i) => (i === 0 ? "option1" : i === 1 ? "option2" : "option3");

  const colors = [];
  const seen = new Set();
  for (const v of p.variants) {
    const c = colorIdx >= 0 ? v[key(colorIdx)] : null;
    if (!c || seen.has(c)) continue;
    seen.add(c);
    // Shopify names variant images with the color slug in them often enough
    // to match; fall back to the featured image.
    const img = v.featured_image?.src || null;
    colors.push({ name: c, image: img });
  }

  const sizes = [];
  const sseen = new Set();
  for (const v of p.variants) {
    const s = sizeIdx >= 0 ? v[key(sizeIdx)] : null;
    if (!s || sseen.has(s)) continue;
    sseen.add(s);
    sizes.push(s);
  }

  return {
    handle: p.handle,
    slug: toSlug(p.handle),
    title: p.title.replace(/\s+/g, " ").trim(),
    vendor: p.vendor || "",
    type: p.product_type || "",
    tags: (p.tags || []).slice(0, 12),
    images: p.images.map((i) => i.src).slice(0, 8),
    colors: colors.slice(0, 60),
    sizes,
    optionNames: p.options.map((o) => o.name),
    variants: p.variants.map((v) => ({
      id: v.id,
      title: v.title,
      available: v.available,
      price: v.price,
      o1: v.option1, o2: v.option2, o3: v.option3,
      img: v.featured_image?.src || null,
    })),
  };
}

/** Light-on-dark logo variants are derived from the dark ones at build time. */
function makeLightLogos() {
  const pub = path.join(process.cwd(), "public");
  const pairs = [
    ["logo.svg", "logo-light.svg", "#ffffff", "#93a8d6"],
    ["mark.svg", "mark-light.svg", "#ffffff", "#ffffff"],
  ];
  for (const [src, dest, ink, blue] of pairs) {
    const from = path.join(pub, src);
    if (!fs.existsSync(from)) continue;
    const svg = fs
      .readFileSync(from, "utf8")
      .replaceAll('fill="#14161c"', `fill="${ink}"`)
      .replaceAll('fill="#4a6193"', `fill="${blue}"`);
    fs.writeFileSync(path.join(pub, dest), svg);
  }
}

async function main() {
  makeLightLogos();

  const collections = (await getJSON(`${SHOP}/collections.json?limit=250`)).collections;

  const products = [];
  for (let page = 1; page <= 40; page++) {
    const d = await getJSON(`${SHOP}/products.json?limit=250&page=${page}`);
    if (!d.products?.length) break;
    products.push(...d.products.map(slimProduct));
    await sleep(500);
    if (d.products.length < 250) break;
  }

  // Which products belong to which collection
  const membership = {};
  const wanted = collections.filter(
    (c) => (c.products_count || 0) > 0 &&
      (BRAND_HANDLES.has(c.handle) || CATEGORY_ORDER.includes(c.handle) || c.handle === "featured-products")
  );
  for (const c of wanted) {
    const handles = [];
    for (let page = 1; page <= 20; page++) {
      const d = await getJSON(`${SHOP}/collections/${c.handle}/products.json?limit=250&page=${page}`);
      if (!d.products?.length) break;
      handles.push(...d.products.map((p) => p.handle));
      await sleep(400);
      if (d.products.length < 250) break;
    }
    membership[c.handle] = handles;
  }

  const meta = (h) => {
    const c = collections.find((x) => x.handle === h);
    return c ? { handle: c.handle, title: c.title.trim(), count: membership[h]?.length || 0 } : null;
  };

  // Guard against two handles collapsing to the same slug.
  const seenSlugs = new Map();
  for (const p of products) {
    if (seenSlugs.has(p.slug)) p.slug = `${p.slug}-${seenSlugs.get(p.slug) + 1}`;
    seenSlugs.set(p.slug, (seenSlugs.get(p.slug) || 0) + 1);
  }

  const out = {
    fetchedAt: new Date().toISOString(),
    products,
    categories: CATEGORY_ORDER.map(meta).filter((c) => c && c.count > 0),
    brands: [...BRAND_HANDLES].map(meta).filter((c) => c && c.count > 0)
      .sort((a, b) => a.title.localeCompare(b.title)),
    featured: membership["featured-products"] || [],
    membership,
  };

  fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), "data/catalog.json"), JSON.stringify(out));

  // Slim index served as a static file so the 1,600-product search does not
  // ride along in every page payload.
  const index = products
    .filter((p) => p.images.length > 0)
    .map((p) => ({ h: p.slug, t: p.title, v: p.vendor, img: p.images[0] }));
  fs.mkdirSync(path.join(process.cwd(), "public"), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), "public/search-index.json"), JSON.stringify(index));
  console.log(
    `catalog: ${out.products.length} products, ${out.categories.length} categories, ${out.brands.length} brands`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
