"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LiteProduct } from "@/lib/catalog";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState<LiteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    let live = true;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((d: LiteProduct[]) => { if (live) { setIndex(d); setLoading(false); } })
      .catch(() => setLoading(false));
    return () => { live = false; };
  }, []);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return index.slice(0, 12);
    const scored: { p: LiteProduct; s: number }[] = [];
    for (const p of index) {
      const hay = `${p.t} ${p.v}`.toLowerCase();
      let s = 0;
      let ok = true;
      for (const t of terms) {
        const at = hay.indexOf(t);
        if (at === -1) { ok = false; break; }
        s += at === 0 ? 3 : at < 24 ? 2 : 1;
      }
      if (ok) scored.push({ p, s });
      if (scored.length > 400) break;
    }
    return scored.sort((a, b) => b.s - a.s).slice(0, 30).map((x) => x.p);
  }, [q, index]);

  useEffect(() => { setActive(0); }, [q]);

  const go = (handle: string) => {
    onClose();
    router.push(`/products/${handle}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active].h); }
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="searchOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="searchPanel" onKeyDown={onKeyDown}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by garment, brand or style number…"
          aria-label="Search products"
        />
        <div className="searchResults">
          {loading ? (
            <div className="searchEmpty">Loading the catalogue…</div>
          ) : results.length === 0 ? (
            <div className="searchEmpty">
              Nothing matched “{q}”. Try a brand like Carhartt, a garment like hoodie, or a style number.
            </div>
          ) : (
            results.map((p, i) => (
              <a
                key={p.h}
                href={`/products/${p.h}`}
                className="searchRow"
                data-active={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={(e) => { e.preventDefault(); go(p.h); }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${p.img}&width=120`} alt="" loading="lazy" />
                <span>
                  <span className="searchRow__v">{p.v || "Blank"}</span>
                  <span className="searchRow__t" style={{ display: "block" }}>{p.t}</span>
                </span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
