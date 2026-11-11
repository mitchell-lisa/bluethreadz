"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";

export type MenuLink = { label: string; href: string; note?: string };
export type MenuColumn = { title: string; links: MenuLink[]; footer?: MenuLink };
export type Menu = { label: string; href: string; columns?: MenuColumn[]; viewAll?: string };

const DESKTOP_LATER = new Set(["Who We Serve", "Featured", "FAQ", "Contact"]);

export function HeaderClient({ menus, phone, phoneDisplay }: { menus: Menu[]; phone: string | null; phoneDisplay: string | null }) {
  const [open, setOpen] = useState(false); // mobile drawer
  const [active, setActive] = useState<string | null>(null); // desktop flyout
  const [expanded, setExpanded] = useState<string | null>(null); // mobile accordion
  const [menuTop, setMenuTop] = useState(112);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const show = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(label);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setActive(null), 120);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setActive(null), setOpen(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const measure = () => {
      if (barRef.current) setMenuTop(barRef.current.getBoundingClientRect().height);
    };
    measure();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", measure);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("resize", measure);
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-40 bg-cloth/95 backdrop-blur border-b border-line">
      <div ref={barRef}>
      <p className="bg-navy text-cloth text-center text-xs sm:text-xs font-display uppercase tracking-[0.08em] sm:tracking-[0.14em] leading-snug py-2 px-4">
        Made to order apparel. Typical production is 7 to 10 business days, plus delivery.
      </p>
      <div className="mx-auto max-w-6xl px-3 sm:px-5 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <a href="/" aria-label="Blue Threadz home" className="shrink min-w-0"><Logo className="h-7 sm:h-9 w-auto max-w-full" /></a>

        <nav className="hidden xl:flex items-center gap-0.5 h-full" onMouseLeave={hide}>
          {menus.map((m) => (
            <div key={m.label} className={`relative h-16 items-center ${DESKTOP_LATER.has(m.label) ? "hidden 2xl:flex" : "flex"}`} onMouseEnter={() => (m.columns ? show(m.label) : setActive(null))}>
              <a
                href={m.href}
                aria-haspopup={m.columns ? "true" : undefined}
                aria-expanded={m.columns ? active === m.label : undefined}
                onFocus={() => m.columns && show(m.label)}
                className={`px-2 h-16 inline-flex items-center gap-1 whitespace-nowrap font-display uppercase tracking-wide text-[12px] xl:text-[13px] font-semibold transition-colors ${active === m.label ? "text-thread" : "text-navy hover:text-thread"}`}
              >
                {m.label}
                {m.columns && <Chevron open={active === m.label} />}
              </a>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {phone && <a href={`tel:${phone}`} className="hidden lg:inline font-display font-semibold text-navy text-lg tracking-wide">{phoneDisplay}</a>}
          <CartButton />
          <a href="/quote" className="hidden sm:inline-flex items-center h-11 px-3 xl:px-4 whitespace-nowrap bg-thread text-white font-display uppercase tracking-wider font-semibold text-[12px] xl:text-[13px] hover:bg-navy transition-colors">Free Quote</a>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)} className="xl:hidden h-11 w-11 grid place-items-center text-navy shrink-0">
            <span className="relative block w-6 h-4">
              <span className={`absolute left-0 h-0.5 w-6 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-6 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>
      </div>

      {/* Desktop flyout: full-width panel under the bar */}
      {menus.map((m) =>
        m.columns && active === m.label ? (
          <div key={m.label} className="hidden xl:block absolute inset-x-0 top-full bg-cloth border-b border-line shadow-[0_24px_40px_-24px_rgba(11,37,69,0.35)]" onMouseEnter={() => show(m.label)} onMouseLeave={hide}>
            <div className="mx-auto max-w-6xl px-5 py-8 grid gap-10" style={{ gridTemplateColumns: `repeat(${m.columns.length}, minmax(0, 1fr))` }}>
              {m.columns.map((col) => (
                <div key={col.title}>
                  <p className="font-display uppercase tracking-[0.2em] text-xs font-semibold text-navy/60 mb-3">{col.title}</p>
                  <ul className={col.links.length > 8 ? "columns-2 gap-6" : ""}>
                    {col.links.map((l) => (
                      <li key={l.label} className="break-inside-avoid">
                        <a href={l.href} onClick={() => setActive(null)} className="group flex items-baseline justify-between gap-3 py-1.5 hover:text-thread">
                          <span className="font-display font-semibold uppercase tracking-tight text-lg leading-tight text-navy group-hover:text-thread">{l.label}</span>
                          {l.note && <span className={`text-xs text-ink-soft ${l.note.length > 6 ? "truncate max-w-[12rem]" : "whitespace-nowrap tabular-nums"}`}>{l.note}</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                  {col.footer && <a href={col.footer.href} onClick={() => setActive(null)} className="mt-3 inline-block font-display uppercase tracking-wider text-sm font-semibold text-thread hover:text-navy">{col.footer.label}</a>}
                </div>
              ))}
            </div>
          </div>
        ) : null,
      )}

    </header>

      {/* Mobile drawer sits outside the header so backdrop-blur does not trap position:fixed. */}
      {open && (
        <nav className="xl:hidden fixed inset-x-0 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-line bg-cloth" style={{ top: menuTop }}>
          <ul className="px-5 py-3 pb-8">
            <li className="pb-3 grid gap-2 border-b border-line">
              <a href="/cart" onClick={() => setOpen(false)} className="flex items-center justify-center h-12 border-2 border-navy text-navy font-display uppercase tracking-wider font-semibold text-lg">Cart</a>
              <a href="/quote" onClick={() => setOpen(false)} className="flex items-center justify-center h-12 bg-navy text-cloth font-display uppercase tracking-wider font-semibold text-lg">Request a Free Quote</a>
            </li>
            {menus.map((m) => (
              <li key={m.label} className="border-b border-line last:border-0">
                {m.columns ? (
                  <>
                    <button type="button" onClick={() => setExpanded(expanded === m.label ? null : m.label)} aria-expanded={expanded === m.label} className="w-full min-h-11 flex items-center justify-between py-3 font-display uppercase tracking-wide text-lg sm:text-xl font-semibold text-navy text-left">
                      {m.label} <Chevron open={expanded === m.label} />
                    </button>
                    {expanded === m.label && (
                      <div className="pb-3 pl-3">
                        <a href={m.href} onClick={() => setOpen(false)} className="flex items-center min-h-11 py-2 font-display uppercase tracking-wider text-sm font-semibold text-thread">{m.viewAll ?? `All ${m.label.toLowerCase()}`} →</a>
                        {m.columns.map((col) => (
                          <div key={col.title} className="mt-2">
                            <p className="font-display uppercase tracking-[0.2em] text-[11px] font-semibold text-navy/50">{col.title}</p>
                            <ul>
                              {col.links.map((l) => (
                                <li key={l.label}><a href={l.href} onClick={() => setOpen(false)} className="flex items-center min-h-11 py-2 text-navy font-semibold">{l.label}</a></li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a href={m.href} onClick={() => setOpen(false)} className="flex items-center min-h-11 py-3 font-display uppercase tracking-wide text-lg sm:text-xl font-semibold text-navy">{m.label}</a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
