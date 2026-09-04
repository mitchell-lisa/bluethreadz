"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { img, money, type Product } from "@/lib/catalog";

const STORE = "https://bluethreadz.com";

/**
 * Gallery + real variant picker. "Add to cart" sends the exact Shopify variant to the
 * existing store's cart, so checkout/payment keep working there. Quote stays alongside.
 */
export function ProductBuy({ p, quoteHref }: { p: Product; quoteHref: string }) {
  const colors = p.colors.map((c) => c.name);
  const sizes = p.sizes;
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [qty, setQty] = useState(1);

  const variant = useMemo(
    () => p.variants.find((v) => (color == null || v[1] === color) && (size == null || v[2] === size)) ?? null,
    [p.variants, color, size],
  );
  const availableSizes = useMemo(() => new Set(p.variants.filter((v) => (color == null || v[1] === color) && v[4]).map((v) => v[2])), [p.variants, color]);
  const image = p.colors.find((c) => c.name === color)?.image ?? p.image;
  const needsSize = sizes.length > 1 && !size;
  const canAdd = variant != null && variant[4] && !needsSize;
  const addUrl = variant ? `${STORE}/cart/add?id=${variant[0]}&quantity=${qty}&return_to=/cart` : "#";

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
      {/* Gallery */}
      <div className="lg:col-span-7">
        <div className="aspect-[3/4] bg-white border border-line">
          <img src={img(image, 1200)} alt={`${p.title}${color ? ` in ${color}` : ""}`} className="h-full w-full object-contain p-4" />
        </div>
      </div>

      {/* Buy box */}
      <div className="lg:col-span-5">
        <Link href={`/products/b/${p.brandSlug}`} className="font-display uppercase tracking-[0.2em] text-sm font-semibold text-thread hover:text-navy">{p.vendor}</Link>
        <h1 className="mt-2 font-display font-bold leading-[1.02] text-3xl md:text-5xl tracking-tight text-navy">{p.title}</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <p className="text-2xl font-semibold text-ink">{variant ? money(variant[3]) : p.minPrice != null ? `from ${money(p.minPrice)}` : ""}</p>
          {p.style && <p className="text-sm text-ink-soft">Style {p.style}</p>}
        </div>

        {colors.length > 0 && (
          <div className="mt-6">
            <p className="font-display uppercase tracking-wider text-xs font-semibold text-navy/70 mb-2">
              Color <span className="text-ink normal-case tracking-normal font-body font-semibold">· {color}</span>
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {p.colors.map((c) => (
                <li key={c.name}>
                  <button type="button" onClick={() => { setColor(c.name); }} aria-label={c.name} aria-pressed={color === c.name} title={c.name}
                    className={`block h-14 w-14 bg-white border overflow-hidden ${color === c.name ? "border-thread ring-2 ring-thread/40" : "border-line hover:border-thread/60"}`}>
                    {c.image ? <img src={img(c.image, 160)} alt="" loading="lazy" className="h-full w-full object-contain p-0.5" /> : <span className="block h-full w-full grid place-items-center text-[10px] text-ink-soft px-1 text-center leading-tight">{c.name}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sizes.length > 1 && (
          <div className="mt-6">
            <p className="font-display uppercase tracking-wider text-xs font-semibold text-navy/70 mb-2">Size{size ? <span className="text-ink normal-case tracking-normal font-body font-semibold"> · {size}</span> : null}</p>
            <ul className="flex flex-wrap gap-1.5">
              {sizes.map((s) => {
                const ok = availableSizes.has(s);
                return (
                  <li key={s}>
                    <button type="button" onClick={() => setSize(s)} disabled={!ok} aria-pressed={size === s}
                      className={`min-w-11 h-11 px-3 border font-semibold text-sm transition-colors ${size === s ? "bg-navy text-white border-navy" : ok ? "border-navy/30 text-navy hover:border-navy" : "border-line text-ink-soft/50 line-through cursor-not-allowed"}`}>
                      {s}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-stretch gap-3">
          <label className="flex items-center border border-navy/30">
            <span className="sr-only">Quantity</span>
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-14 w-11 text-xl text-navy hover:bg-white" aria-label="Decrease quantity">−</button>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))} className="w-14 h-14 text-center bg-transparent font-semibold text-ink focus:outline-none" />
            <button type="button" onClick={() => setQty((q) => q + 1)} className="h-14 w-11 text-xl text-navy hover:bg-white" aria-label="Increase quantity">+</button>
          </label>
          <a
            href={canAdd ? addUrl : undefined}
            aria-disabled={!canAdd}
            onClick={(e) => { if (!canAdd) e.preventDefault(); }}
            className={`flex-1 inline-flex items-center justify-center h-14 px-6 font-display uppercase tracking-wider font-bold text-lg transition-colors ${canAdd ? "bg-thread text-white hover:bg-navy" : "bg-line text-ink-soft cursor-not-allowed"}`}
          >
            {needsSize ? "Select a size" : variant && !variant[4] ? "Sold out" : "Add to cart"}
          </a>
        </div>
        <p className="mt-2 text-xs text-ink-soft">Checkout happens on our secure online store. Want your logo on it? Use the quote button below.</p>

        <Link href={quoteHref} className="mt-4 inline-flex w-full items-center justify-center h-12 px-6 border-2 border-navy text-navy font-display uppercase tracking-wider font-semibold hover:bg-navy hover:text-white transition-colors">
          Get a quote with your logo
        </Link>

        {p.intro && <p className="mt-8 text-[17px] leading-relaxed text-ink">{p.intro}</p>}

        {p.features.length > 0 && (
          <div className="mt-6">
            <p className="font-display uppercase tracking-wider text-xs font-semibold text-navy/70 mb-2">Details</p>
            <ul className="space-y-1.5 text-[15px] text-ink leading-snug">
              {p.features.map((f) => (
                <li key={f} className="pl-4 relative before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:bg-thread">{f}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
