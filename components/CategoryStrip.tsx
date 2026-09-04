import Link from "next/link";
import { collections, flatImage, hasFlatImage, img, productsInCollection } from "@/lib/catalog";

// Keep each tile's photo on-type (the Shopify collections are loose: bags show up under "zips").
const KIND: Record<string, RegExp> = {
  tees: /\btee\b|t-shirt/i,
  "hooded-sweatshirts": /hood|sweatshirt|fleece/i,
  "1-4-zips": /zip|pullover/i,
  "polos-knits": /polo/i,
  "hats-beanies": /\bcap\b|\bhat\b|beanie/i,
  "duffel-bags-backpacks": /bag|backpack|cooler|duffel|tote/i,
  "high-visibility-workwear": /vest|safety|reflective|hi-vis/i,
  ladies: /women/i,
  youth: /youth/i,
};
function tileProduct(slug: string) {
  const all = productsInCollection(slug);
  const kind = KIND[slug];
  const typed = kind ? all.filter((p) => kind.test(p.title)) : all;
  return typed.find(hasFlatImage) ?? typed[0] ?? all.find(hasFlatImage) ?? all[0];
}

/** Image-led category strip, right under the hero — the pattern every major custom-apparel site uses. */
export function CategoryStrip() {
  return (
    <section className="bg-white border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-display font-bold uppercase text-2xl md:text-3xl tracking-tight text-navy">Shop by category</h2>
          <Link href="/products" className="font-display uppercase tracking-wider text-sm font-semibold text-thread hover:text-navy">All products →</Link>
        </div>
        <ul className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {collections.map((c) => {
            const p = tileProduct(c.slug);
            return (
              <li key={c.slug}>
                <Link href={`/products/c/${c.slug}`} className="group block text-center">
                  <div className="aspect-square bg-cloth border border-line overflow-hidden">
                    {p && <img src={img(flatImage(p), 400)} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />}
                  </div>
                  <span className="mt-2 block font-display uppercase tracking-wide text-[13px] leading-tight font-semibold text-navy group-hover:text-thread">{c.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
