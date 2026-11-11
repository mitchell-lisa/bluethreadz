"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ShopProductCard } from "./ShopProductCard";
import type { ShopCard } from "@/lib/shopify/types";

const SORTS = [
  { id: "title", label: "Name" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export function StoreBrowser({ products }: { products: ShopCard[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortId>("title");
  const [type, setType] = useState<string>("all");

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      const key = p.productType || "Other";
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [products]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = products.filter((p) => {
      if (type !== "all" && (p.productType || "Other") !== type) return false;
      if (!needle) return true;
      return `${p.title} ${p.vendor} ${p.productType}`.toLowerCase().includes(needle);
    });
    const copy = [...list];
    copy.sort((a, b) => {
      if (sort === "price-asc") return Number(a.minPrice) - Number(b.minPrice) || a.title.localeCompare(b.title);
      if (sort === "price-desc") return Number(b.minPrice) - Number(a.minPrice) || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });
    return copy;
  }, [products, q, sort, type]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-8">
        <label className="flex-1 max-w-sm">
          <span className="sr-only">Search this store</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search this store"
            className="w-full h-11 px-3 border border-line bg-white text-ink"
          />
        </label>
        <label className="text-sm text-ink-soft">
          <span className="sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="h-11 px-3 border border-line bg-white text-ink"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
        <p className="text-sm text-ink-soft lg:ml-auto">
          Showing {shown.length} of {products.length}
        </p>
      </div>

      {types.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <FilterChip pressed={type === "all"} onClick={() => setType("all")}>All</FilterChip>
          {types.map(([name, count]) => (
            <FilterChip key={name} pressed={type === name} onClick={() => setType(name)}>
              {name} ({count})
            </FilterChip>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-ink-soft">Nothing in this store matches that search.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {shown.map((p) => (
            <li key={p.id}><ShopProductCard product={p} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 px-3 border text-sm font-display uppercase tracking-wide ${pressed ? "bg-navy text-cloth border-navy" : "bg-white text-navy border-line hover:border-navy"}`}
    >
      {children}
    </button>
  );
}
