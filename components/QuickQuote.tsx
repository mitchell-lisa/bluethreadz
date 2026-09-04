"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const ITEMS = ["T-shirts", "Hoodies & sweatshirts", "Polos", "Quarter-zips & jackets", "Hats & beanies", "Bags & coolers", "Hi-vis & workwear", "Something else"];
const METHODS = ["Not sure — recommend one", "Embroidery", "Screen Printing", "Dye-Sublimation", "Heat Transfer", "DTG"];

/** Three fields, one button. The fastest path on the site to a quote request. */
export function QuickQuote() {
  const router = useRouter();
  const [item, setItem] = useState(ITEMS[0]);
  const [qty, setQty] = useState("24");
  const [method, setMethod] = useState(METHODS[0]);
  function go(e: FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({ item, qty: qty.replace(/\D/g, "") || "1" });
    if (!method.startsWith("Not sure")) q.set("method", method);
    router.push(`/quote?${q.toString()}`);
  }
  const field = "h-12 w-full bg-white text-ink border border-white/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-thread-bright";
  return (
    <section className="bg-navy text-white weave">
      <form onSubmit={go} className="mx-auto max-w-6xl px-5 py-6 md:py-7 grid md:grid-cols-[auto_1fr_1fr_1fr_auto] items-end gap-3 md:gap-4">
        <div className="md:pr-4 md:self-center">
          <p className="font-display uppercase tracking-[0.2em] text-[11px] font-semibold text-thread-bright">Quick quote</p>
          <p className="font-display font-bold text-xl leading-tight text-white whitespace-nowrap">Know what you need?</p>
        </div>
        <label className="block"><span className="block text-[11px] uppercase tracking-wider font-semibold text-white/70 mb-1">What</span>
          <select value={item} onChange={(e) => setItem(e.target.value)} className={field}>{ITEMS.map((i) => <option key={i}>{i}</option>)}</select></label>
        <label className="block"><span className="block text-[11px] uppercase tracking-wider font-semibold text-white/70 mb-1">How many</span>
          <input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} className={field} /></label>
        <label className="block"><span className="block text-[11px] uppercase tracking-wider font-semibold text-white/70 mb-1">Method</span>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className={field}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></label>
        <button type="submit" className="h-12 px-6 whitespace-nowrap bg-thread-bright text-navy-deep font-display uppercase tracking-wider text-[13px] font-bold hover:bg-white transition-colors">Get my quote →</button>
      </form>
    </section>
  );
}
