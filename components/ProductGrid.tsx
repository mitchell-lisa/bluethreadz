"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { img, money, type ProductCard } from "@/lib/catalog";

type Facet = { slug: string; name: string; count: number };

export function ProductGrid({
  items,
  facetLabel,
  facets,
}: {
  items: ProductCard[];
  facetLabel: string;
  /** Optional secondary filter (brands within a category, or categories within a brand). */
  facets?: { key: "brandSlug"; options: Facet[] };
}) {
  const [active, setActive] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (p) =>
        (!active || p[facets!.key] === active) &&
        (!needle || `${p.title} ${p.vendor} ${p.style ?? ""}`.toLowerCase().includes(needle)),
    );
  }, [items, active, q, facets]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8">
        <label className="flex-1 max-w-sm">
          <span className="sr-only">Search {facetLabel}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${facetLabel.toLowerCase()} by name or style #`}
            className="w-full h-11 px-4 bg-white border border-line focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </label>
        <p className="font-display uppercase tracking-wider text-sm font-semibold text-navy/60">
          {shown.length} of {items.length}
        </p>
      </div>

      {facets && facets.options.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <FacetChip label="All" active={active === null} onClick={() => setActive(null)} />
          {facets.options.map((f) => (
            <FacetChip
              key={f.slug}
              label={`${f.name} (${f.count})`}
              active={active === f.slug}
              onClick={() => setActive(active === f.slug ? null : f.slug)}
            />
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="py-16 text-center text-ink-soft">
          Nothing matches. Try a different search, or{" "}
          <Link href="/quote" className="underline text-navy">
            ask us for it in a quote
          </Link>
          .
        </p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {shown.map((p) => (
            <li key={p.handle}>
              <ProductTile p={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FacetChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-9 px-3 font-display uppercase tracking-wider text-sm font-semibold border transition-colors ${
        active ? "bg-navy text-cloth border-navy" : "border-navy/25 text-navy hover:border-navy"
      }`}
    >
      {label}
    </button>
  );
}

export function ProductTile({ p }: { p: ProductCard }) {
  const price = money(p.minPrice);
  return (
    <Link href={`/products/${p.slug}`} className="group block">
      <div className="aspect-[3/4] bg-white overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img(p.image, 600)}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3">
        <p className="font-display uppercase tracking-wider text-xs font-semibold text-navy/60">{p.vendor}</p>
        <h3 className="mt-0.5 font-display font-semibold text-lg leading-tight text-navy group-hover:text-thread">
          {p.title}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">
          {price ? `From ${price}` : ""}
          {price && p.colorCount > 1 ? " · " : ""}
          {p.colorCount > 1 ? `${p.colorCount} colors` : ""}
        </p>
      </div>
    </Link>
  );
}
