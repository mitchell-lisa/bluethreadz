"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { business } from "@/lib/business";

export default function BuyBox({ p }: { p: Product }) {
  const colorIdx = p.optionNames.findIndex((n) => /colou?r/i.test(n));
  const sizeIdx = p.optionNames.findIndex((n) => /size/i.test(n));
  const key = (i: number) => (i === 0 ? "o1" : i === 1 ? "o2" : "o3") as "o1" | "o2" | "o3";

  const [color, setColor] = useState(p.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(12);
  const [shot, setShot] = useState(0);

  const images = useMemo(() => {
    const colorShot = p.colors.find((c) => c.name === color)?.image;
    const list = [...p.images];
    if (colorShot && !list.includes(colorShot)) list.unshift(colorShot);
    else if (colorShot) {
      list.splice(list.indexOf(colorShot), 1);
      list.unshift(colorShot);
    }
    return list;
  }, [p, color]);

  const sizesForColor = useMemo(() => {
    if (sizeIdx < 0) return [];
    return p.sizes.map((s) => {
      const v = p.variants.find(
        (v) => (colorIdx < 0 || v[key(colorIdx)] === color) && v[key(sizeIdx)] === s
      );
      return { name: s, available: Boolean(v?.available), id: v?.id };
    });
  }, [p, color, colorIdx, sizeIdx]);

  const variant = useMemo(() => {
    return p.variants.find(
      (v) =>
        (colorIdx < 0 || v[key(colorIdx)] === color) &&
        (sizeIdx < 0 || !size || v[key(sizeIdx)] === size)
    );
  }, [p, color, size, colorIdx, sizeIdx]);

  const cartUrl = variant
    ? `${business.shopUrl}/cart/add?id=${variant.id}&quantity=${qty}`
    : null;

  const quoteUrl = `/quote?${new URLSearchParams({
    garment: p.title,
    handle: p.slug,
    color,
    qty: String(qty),
  }).toString()}`;

  return (
    <div className="pdp">
      <div className="gallery">
        <div className="gallery__main">
          {images[shot] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={`${images[shot]}&width=1000`} alt={p.title} />
          ) : null}
        </div>
        {images.length > 1 && (
          <div className="gallery__thumbs">
            {images.slice(0, 8).map((src, i) => (
              <button
                key={src}
                className="gallery__thumb"
                aria-pressed={i === shot}
                aria-label={`View image ${i + 1}`}
                onClick={() => setShot(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${src}&width=160`} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="buybox">
        {p.vendor ? <span className="label">{p.vendor}</span> : null}
        <h1 className="buybox__title">{p.title}</h1>

        {p.colors.length > 0 && (
          <div className="field">
            <span className="label">Colour · {color}</span>
            <div className="swatches">
              {p.colors.map((c) => (
                <button
                  key={c.name}
                  className="swatch"
                  aria-label={c.name}
                  title={c.name}
                  aria-pressed={c.name === color}
                  style={c.image ? { backgroundImage: `url(${c.image}&width=90)` } : { background: "var(--heather)" }}
                  onClick={() => { setColor(c.name); setShot(0); }}
                />
              ))}
            </div>
          </div>
        )}

        {sizesForColor.length > 0 && (
          <div className="field">
            <span className="label">Size</span>
            <div className="sizeRow">
              {sizesForColor.map((s) => (
                <button
                  key={s.name}
                  className="sizeBtn"
                  aria-pressed={size === s.name}
                  disabled={!s.available}
                  onClick={() => setSize(s.name)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="field">
          <span className="label">Quantity</span>
          <input
            className="range"
            type="range"
            min={1}
            max={144}
            value={qty}
            aria-label="Quantity"
            onChange={(e) => setQty(Number(e.target.value))}
          />
          <span className="mono muted">{qty} piece{qty === 1 ? "" : "s"}</span>
        </div>

        <div style={{ display: "grid", gap: "0.6rem" }}>
          <Link href={quoteUrl} className="btn btn--thread btn--block">
            Get a quote with your logo
          </Link>
          {cartUrl && (
            <a href={cartUrl} className="btn btn--ghost btn--block" rel="nofollow">
              Buy blank on bluethreadz.com
            </a>
          )}
        </div>

        <p className="note">
          Decoration is quoted, not checked out. The cart link takes you to our Shopify store for
          undecorated garments; for anything with your logo on it, start a quote and we will price
          the run.
        </p>
      </div>
    </div>
  );
}
