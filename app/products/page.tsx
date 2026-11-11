import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { brands, collections, img, productsInCollection } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products | BlueThreadz Custom Apparel Catalog",
  description:
    "Browse tees, hoodies, polos, hats, bags and workwear from Nike, Carhartt, Port Authority and 30 more brands, all available with custom embroidery or printing.",
};

export default function ProductsPage() {
  return (
    <Shell title="Apparel catalog" line="Blank styles we can decorate.">
      <h2 className="font-display font-bold text-lg text-navy mb-4">Categories</h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {collections.map((c) => {
          const sample = productsInCollection(c.slug).slice(0, 3);
          return (
            <li key={c.slug}>
              <Link href={`/products/c/${c.slug}`} className="group block bg-white border border-line hover:border-navy transition-colors">
                <div className="grid grid-cols-3 gap-px bg-line/60 aspect-[3/2]">
                  {sample.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.handle} src={img(p.image, 400)} alt="" loading="lazy" className="h-full w-full object-contain bg-white p-2" />
                  ))}
                </div>
                <div className="p-3 sm:p-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                  <h3 className="min-w-0 font-display font-bold uppercase text-base sm:text-xl leading-tight tracking-tight text-navy group-hover:text-thread">
                    {c.name}
                  </h3>
                  <span className="text-sm text-ink-soft sm:shrink-0">{c.count} styles</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-10 font-display font-bold text-lg text-navy mb-4">Brands</h2>
      <ul className="flex flex-wrap gap-2">
        {brands.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/products/b/${b.slug}`}
              className="inline-flex items-baseline gap-2 px-3 py-2 border border-navy/20 hover:border-navy hover:bg-white transition-colors font-display font-bold uppercase text-xl md:text-2xl tracking-tight text-navy leading-none"
            >
              {b.name}
              <span className="font-body font-normal normal-case text-xs text-ink-soft tracking-normal">{b.count}</span>
            </Link>
          </li>
        ))}
      </ul>

    </Shell>
  );
}
