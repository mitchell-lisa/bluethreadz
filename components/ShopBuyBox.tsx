"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/shopify/actions";
import { formatMoney, shopImage } from "@/lib/shopify/format";
import type { ShopProduct, ShopVariant } from "@/lib/shopify/types";

function isDefaultOption(option: { name: string; values: string[] }) {
  return option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title";
}

function matches(variant: ShopVariant, selection: Record<string, string>) {
  return variant.options.every((o) => selection[o.name] === o.value);
}

function selectionOf(variant: ShopVariant) {
  return Object.fromEntries(variant.options.map((o) => [o.name, o.value]));
}

function pretty(value: string) {
  if (/[A-Z]/.test(value) && !/^[a-z]/.test(value)) return value;
  return value.replace(/-/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

export function ShopBuyBox({ product }: { product: ShopProduct }) {
  const options = product.options.filter((o) => !isDefaultOption(o));
  const first = product.variants.find((v) => v.available) ?? product.variants[0];
  const [selection, setSelection] = useState<Record<string, string>>(first ? selectionOf(first) : {});
  const [shot, setShot] = useState(0);
  const [qty, setQty] = useState(1);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => matches(v, selection)) ?? null,
    [product.variants, selection],
  );

  const gallery = useMemo(() => {
    const urls: { url: string; alt: string | null }[] = [];
    const push = (url: string | null, alt: string | null) => {
      if (!url || urls.some((u) => u.url === url)) return;
      urls.push({ url, alt });
    };
    if (variant?.image) push(variant.image, variant.imageAlt);
    for (const img of product.images) push(img.url, img.alt);
    return urls;
  }, [product.images, variant]);

  const activeShot = gallery[shot] ?? gallery[0];

  function choose(name: string, value: string) {
    setAdded(false);
    setMessage(null);
    const next = { ...selection, [name]: value };
    if (product.variants.some((v) => matches(v, next))) {
      setSelection(next);
      setShot(0);
      return;
    }
    const candidates = product.variants.filter((v) => v.options.some((o) => o.name === name && o.value === value));
    const ranked = [...candidates].sort((a, b) => {
      const score = (v: ShopVariant) =>
        v.options.filter((o) => o.name === name || selection[o.name] === o.value).length + (v.available ? 0.5 : 0);
      return score(b) - score(a);
    });
    if (ranked[0]) {
      setSelection(selectionOf(ranked[0]));
      setShot(0);
    }
  }

  function valueAvailable(name: string, value: string) {
    return product.variants.some(
      (v) =>
        v.available &&
        v.options.every((o) => (o.name === name ? o.value === value : selection[o.name] === o.value)),
    );
  }

  async function onAdd() {
    if (!variant || !variant.available) return;
    setPending(true);
    setMessage(null);
    const result = await addToCart(variant.id, qty);
    setPending(false);
    if ("error" in result) {
      setAdded(false);
      setMessage(result.error);
      return;
    }
    setAdded(true);
    window.dispatchEvent(new Event("cart:updated"));
  }

  const price = variant ? formatMoney(variant.price, variant.currency) : formatMoney(product.minPrice, product.currency);

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
      <div>
        <div className="aspect-square bg-white border border-line grid place-items-center overflow-hidden">
          {activeShot ? (
            <img
              src={shopImage(activeShot.url, 1200) || activeShot.url}
              alt={activeShot.alt || product.title}
              className="h-full w-full object-contain p-4"
            />
          ) : (
            <p className="text-ink-soft">No photo yet</p>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {gallery.slice(0, 12).map((img, i) => (
              <button
                key={img.url}
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === Math.min(shot, gallery.length - 1)}
                onClick={() => setShot(i)}
                className={`h-16 w-14 border bg-white p-1 ${i === shot ? "border-navy" : "border-line"}`}
              >
                <img src={shopImage(img.url, 160) || img.url} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display font-bold leading-[1.05] text-3xl md:text-4xl tracking-tight text-ink">{product.title}</h1>
        <p className="mt-3 text-2xl font-semibold text-navy">{price}</p>

        <div className="mt-6 grid gap-5">
          {options.map((option) => {
            const color = /colou?r/i.test(option.name);
            const size = /size/i.test(option.name);
            return (
              <fieldset key={option.name} className="grid gap-2">
                <legend className="font-display uppercase tracking-[0.16em] text-xs font-semibold text-navy/70">
                  {option.name}
                  {selection[option.name] ? `: ${pretty(selection[option.name])}` : ""}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const pressed = selection[option.name] === value;
                    const available = valueAvailable(option.name, value);
                    const swatch = color
                      ? product.variants.find((v) => v.options.some((o) => o.name === option.name && o.value === value) && v.image)?.image
                      : null;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={pressed}
                        disabled={!available && !pressed}
                        title={available ? pretty(value) : `${pretty(value)} is sold out`}
                        onClick={() => choose(option.name, value)}
                        className={
                          color && swatch
                            ? `h-11 w-11 border bg-white bg-cover bg-center ${pressed ? "border-navy ring-2 ring-navy ring-offset-2" : "border-line"} disabled:opacity-40`
                            : `${size ? "min-w-11 px-3" : "px-3"} min-h-11 border text-sm ${pressed ? "bg-navy text-cloth border-navy" : "bg-white text-navy border-line hover:border-navy"} disabled:opacity-40 disabled:line-through`
                        }
                        style={color && swatch ? { backgroundImage: `url(${shopImage(swatch, 90)})` } : undefined}
                      >
                        {color && swatch ? <span className="sr-only">{pretty(value)}</span> : pretty(value)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          <label className="grid gap-2 max-w-[8rem]">
            <span className="font-display uppercase tracking-[0.16em] text-xs font-semibold text-navy/70">Quantity</span>
            <input
              type="number"
              min={1}
              max={99}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
              className="h-11 px-3 border border-line bg-white"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={pending || !variant?.available}
          className="mt-8 inline-flex items-center justify-center h-14 px-8 w-full sm:w-auto bg-thread text-white font-display uppercase tracking-wider font-bold text-sm hover:bg-navy transition-colors disabled:opacity-50"
        >
          {pending ? "Adding..." : variant?.available ? "Add to cart" : "Sold out"}
        </button>

        {added && (
          <p className="mt-4 text-navy">
            Added to your cart.{" "}
            <Link href="/cart" className="underline font-semibold">View cart and checkout</Link>
          </p>
        )}
        {message && <p className="mt-4 text-ink-soft">{message}</p>}
      </div>
    </div>
  );
}
