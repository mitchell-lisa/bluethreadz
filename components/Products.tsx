import Link from "next/link";
import { collections, brands } from "@/lib/catalog";
import { Section } from "./Section";

export function Products() {
  return (
    <Section
      id="products"
      eyebrow="What we decorate"
      title="Real brands. Not blank-box mystery tees."
      intro="We decorate garments people actually want to wear, from name brands you already trust. Browse the catalog, or just tell us what you need and we’ll pull options."
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <h3 className="font-display uppercase tracking-[0.2em] text-sm font-semibold text-navy/60 mb-4">
            Categories
          </h3>
          <ul className="divide-y divide-navy/15 border-y border-navy/15">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products/c/${c.slug}`}
                  className="flex items-center justify-between py-3.5 font-display font-semibold uppercase text-xl tracking-tight text-navy hover:text-thread group"
                >
                  {c.name}
                  <span className="text-sm font-body font-normal text-ink-soft">{c.count} styles</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center h-12 px-6 border-2 border-navy text-navy font-display uppercase tracking-wider font-semibold hover:bg-navy hover:text-cloth transition-colors"
          >
            Browse the full catalog
          </Link>
        </div>

        <div className="lg:col-span-7">
          <h3 className="font-display uppercase tracking-[0.2em] text-sm font-semibold text-navy/60 mb-4">
            Brands we stock
          </h3>
          <ul className="flex flex-wrap gap-x-2 gap-y-2">
            {brands.slice(0, 20).map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/products/b/${b.slug}`}
                  className="block font-display font-bold uppercase text-2xl md:text-3xl tracking-tight text-navy leading-none px-3 py-2 border border-navy/20 hover:border-navy hover:bg-white transition-colors"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-ink-soft max-w-lg">
            Looking for a brand that isn’t listed? Ask us in your quote request.
          </p>
        </div>
      </div>
    </Section>
  );
}
