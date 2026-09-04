"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Desktop-only floating quote button that appears once the visitor scrolls past the hero. */
export function QuoteFab() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <Link
      href="/quote"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`hidden sm:flex fixed bottom-6 right-6 z-40 items-center gap-2 h-12 pl-4 pr-5 bg-thread text-white font-display uppercase tracking-wider text-[13px] font-bold shadow-[0_18px_40px_-16px_rgba(38,57,106,.6)] transition-all duration-300 hover:bg-navy ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}
    >
      <span className="h-2 w-2 rounded-full bg-white/90 animate-pulse" aria-hidden />
      Get a free quote
    </Link>
  );
}
