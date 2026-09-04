import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { brands, collections, img, productsInCollection } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products — BlueThreadz Custom Apparel Catalog",
  description:
    "Browse tees, hoodies, polos, hats, bags and workwear from Nike, Carhartt, Port Authority and 30 more brands — all available with custom embroidery or printing.",
};

export default function ProductsPage() {
  const total = collections.reduce((n, c) => n + c.count, 0);
  return (
    <Shell
      eyebrow="Catalog"
      title="Pick the garment. We’ll put your name on it."
      intro={`Every item here can be embroidered or printed with your logo. Browse by category or brand, then request a quote for the pieces you like.`}
    >
      <h2 className="font-display uppercase tracking-[0.2em] text-sm font-semibold text-navy/60 mb-5">Categories</h2>
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
                <div className="p-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display font-bold uppercase text-xl leading-none tracking-tight text-navy group-hover:text-thread">
                    {c.name}
                  </h3>
                  <span className="text-sm text-ink-soft shrink-0">{c.count} styles</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-14 font-display uppercase tracking-[0.2em] text-sm font-semibold text-navy/60 mb-5">
        Brands
      </h2>
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

      <div className="mt-14 bg-navy text-cloth p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <p className="font-display font-bold uppercase text-2xl md:text-3xl leading-none tracking-tight">
            {total.toLocaleString()} styles and counting
          </p>
          <p className="mt-2 text-cloth/75">Don’t see what you need? Tell us and we’ll find it.</p>
        </div>
        <Link
          href="/quote"
          className="inline-flex items-center justify-center h-12 px-6 bg-cloth text-navy font-display uppercase tracking-wider font-bold hover:bg-white shrink-0"
        >
          Request a Quote
        </Link>
      </div>
    </Shell>
  );
}
