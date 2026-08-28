"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Collection } from "@/lib/catalog";
import { methods, audiences, threads } from "@/lib/business";
import { useThread } from "./ThreadContext";
import SearchOverlay from "./SearchOverlay";

type Props = { categories: Collection[]; brands: Collection[]; count: number };

const MENUS = ["Shop", "Decoration", "Industries"] as const;
type Menu = (typeof MENUS)[number];

export default function Header({ categories, brands, count }: Props) {
  const [open, setOpen] = useState<Menu | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>("Shop");
  const { thread, setThread } = useThread();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") {
        setOpen(null);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);

  const close = () => setOpen(null);

  return (
    <>
      <header className="hdr" ref={headerRef} onMouseLeave={close}>
        <div className="wrap hdr__bar">
          <Link href="/" className="hdr__logo" aria-label="BlueThreadz home" onClick={() => { close(); setDrawer(false); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="BlueThreadz" width={207} height={26} />
          </Link>

          <nav className="hdr__nav" aria-label="Main">
            {MENUS.map((m) => (
              <button
                key={m}
                className="hdr__item"
                data-open={open === m}
                aria-expanded={open === m}
                onMouseEnter={() => setOpen(m)}
                onFocus={() => setOpen(m)}
                onClick={() => setOpen(open === m ? null : m)}
              >
                {m}
                <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true">
                  <path d="M1 1l3.5 3.5L8 1" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            ))}
            <Link href="/how-it-works" className="hdr__item" onMouseEnter={close}>How it works</Link>
          </nav>

          <span className="hdr__spacer" />

          <div className="rack" title={`Thread colour: ${thread.name}`}>
            <span className="label label--plain">Thread</span>
            <span className="rack__spools">
              {threads.map((t) => (
                <button
                  key={t.name}
                  className="rack__spool"
                  style={{ background: t.hex }}
                  aria-label={`Set accent to ${t.name}`}
                  aria-pressed={thread.hex === t.hex}
                  onClick={() => setThread(t)}
                />
              ))}
            </span>
          </div>

          <button className="hdr__search" onClick={() => setSearch(true)}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span>Search {count.toLocaleString()} products</span>
            <span className="hdr__kbd">⌘K</span>
          </button>

          <Link href="/quote" className="btn btn--thread btn--sm hdr__cta" onMouseEnter={close}>
            Start a quote
          </Link>

          <button
            className="burger"
            aria-label={drawer ? "Close menu" : "Open menu"}
            aria-expanded={drawer}
            onClick={() => setDrawer((d) => !d)}
          >
            <svg width="24" height="16" viewBox="0 0 24 16" aria-hidden="true">
              {drawer ? (
                <path d="M3 3l18 10M21 3L3 13" stroke="currentColor" strokeWidth="1.8" />
              ) : (
                <path d="M0 2h24M0 8h24M0 14h24" stroke="currentColor" strokeWidth="1.8" />
              )}
            </svg>
          </button>
        </div>

        {open === "Shop" && (
          <div className="mega wrap" onMouseLeave={close}>
            <div className="mega__grid">
              <div className="mega__col">
                <span className="label">By category</span>
                {categories.slice(0, 7).map((c) => (
                  <Link key={c.handle} href={`/products/c/${c.handle}`} className="mega__link" onClick={close}>
                    <span>{c.title}</span>
                    <span className="mega__count">{c.count}</span>
                  </Link>
                ))}
              </div>
              <div className="mega__col">
                <span className="label label--plain">&nbsp;</span>
                {categories.slice(7).map((c) => (
                  <Link key={c.handle} href={`/products/c/${c.handle}`} className="mega__link" onClick={close}>
                    <span>{c.title}</span>
                    <span className="mega__count">{c.count}</span>
                  </Link>
                ))}
                <Link href="/products" className="mega__link" onClick={close}>
                  <span><b>Browse everything</b></span>
                </Link>
              </div>
              <div className="mega__col">
                <span className="label">By brand</span>
                {brands.slice(0, 11).map((b) => (
                  <Link key={b.handle} href={`/products/b/${b.handle}`} className="mega__link" onClick={close}>
                    <span>{b.title}</span>
                    <span className="mega__count">{b.count}</span>
                  </Link>
                ))}
              </div>
              <div className="mega__col">
                <span className="label label--plain">&nbsp;</span>
                {brands.slice(11).map((b) => (
                  <Link key={b.handle} href={`/products/b/${b.handle}`} className="mega__link" onClick={close}>
                    <span>{b.title}</span>
                    <span className="mega__count">{b.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {open === "Decoration" && (
          <div className="mega wrap" onMouseLeave={close}>
            <div className="mega__grid">
              {methods.map((m) => (
                <Link key={m.slug} href={`/how-it-works#${m.slug}`} className="mega__col" onClick={close}>
                  <span className="label">{m.name}</span>
                  <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--ink-soft)", lineHeight: 1.5 }}>
                    {m.blurb}
                  </p>
                  <span className="mono muted">{m.best}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {open === "Industries" && (
          <div className="mega wrap" onMouseLeave={close}>
            <div className="mega__grid">
              {audiences.map((a) => (
                <Link key={a.name} href="/quote" className="mega__col" onClick={close}>
                  <span className="label">{a.name}</span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink-soft)" }}>{a.note}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {drawer && (
        <div className="drawer">
          <button className="btn btn--thread btn--block" onClick={() => { setDrawer(false); setSearch(true); }}>
            Search {count.toLocaleString()} products
          </button>

          <div style={{ marginTop: "1.4rem" }}>
            {[
              { name: "Shop", items: [...categories.map((c) => ({ href: `/products/c/${c.handle}`, label: `${c.title} (${c.count})` })), { href: "/products", label: "Browse everything" }] },
              { name: "Brands", items: brands.map((b) => ({ href: `/products/b/${b.handle}`, label: `${b.title} (${b.count})` })) },
              { name: "Decoration", items: methods.map((m) => ({ href: `/how-it-works#${m.slug}`, label: m.name })) },
            ].map((g) => (
              <div className="drawer__group" key={g.name}>
                <button
                  className="drawer__toggle"
                  aria-expanded={openGroup === g.name}
                  onClick={() => setOpenGroup(openGroup === g.name ? null : g.name)}
                >
                  {g.name}
                  <span aria-hidden="true">{openGroup === g.name ? "–" : "+"}</span>
                </button>
                {openGroup === g.name && (
                  <div className="drawer__links">
                    {g.items.map((i) => (
                      <Link key={i.href + i.label} href={i.href} onClick={() => setDrawer(false)}>
                        {i.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="drawer__group">
              <Link href="/how-it-works" className="drawer__toggle" onClick={() => setDrawer(false)}>
                How it works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div style={{ marginTop: "1.6rem" }}>
            <span className="label">Thread colour</span>
            <div className="rack__spools" style={{ display: "flex", marginTop: "0.7rem", gap: "0.4rem", flexWrap: "wrap" }}>
              {threads.map((t) => (
                <button
                  key={t.name}
                  className="rack__spool"
                  style={{ background: t.hex, width: 26, height: 32 }}
                  aria-label={`Set accent to ${t.name}`}
                  aria-pressed={thread.hex === t.hex}
                  onClick={() => setThread(t)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bottombar">
        <Link href="/products" className="btn btn--ghost">Browse</Link>
        <Link href="/quote" className="btn btn--thread">Start a quote</Link>
      </div>

      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  );
}
