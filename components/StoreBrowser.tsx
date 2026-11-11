"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ShopProductCard } from "./ShopProductCard";
import type { ShopCard } from "@/lib/shopify/types";

const SORTS = [
  { id: "title", label: "Name" },
  { id: "price-asc", label: "Price up" },
  { id: "price-desc", label: "Price down" },
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

  const showChips = useMemo(() => {
    const real = types.filter(([, count]) => count >= 3);
    const top = real[0]?.[1] ?? 0;
    return real.length >= 2 && top < products.length * 0.85;
  }, [types, products.length]);

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
      <div className="flex gap-2 mb-3">
        <label className="flex-1 min-w-0">
          <span className="sr-only">Search this store</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full h-11 px-3 border border-line bg-white text-ink"
          />
        </label>
        <label className="shrink-0">
          <span className="sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="h-11 px-2 border border-line bg-white text-ink"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {showChips && (
        <div className="mb-4 -mx-5 px-5 flex gap-2 overflow-x-auto">
          <FilterChip pressed={type === "all"} onClick={() => setType("all")}>All</FilterChip>
          {types.filter(([, count]) => count >= 3).map(([name, count]) => (
            <FilterChip key={name} pressed={type === name} onClick={() => setType(name)}>
              {name} ({count})
            </FilterChip>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-ink-soft">Nothing matches.</p>
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
      className={`h-8 shrink-0 whitespace-nowrap px-3 border text-xs font-display uppercase tracking-wide ${pressed ? "bg-navy text-cloth border-navy" : "bg-white text-navy border-line hover:border-navy"}`}
    >
      {children}
    </button>
  );
}
