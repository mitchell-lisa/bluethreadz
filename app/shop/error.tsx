"use client";

import Link from "next/link";

export default function ShopError() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <h1 className="font-display font-bold uppercase text-4xl">The shop could not load</h1>
      <p className="mt-4 text-ink-soft max-w-xl">
        The product catalog did not come back from Shopify. Refresh the page in a moment, or start a quote and we will help from there.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/shop" className="inline-flex items-center h-12 px-6 bg-navy text-cloth font-display uppercase tracking-wider font-semibold">Team stores</Link>
        <Link href="/quote" className="inline-flex items-center h-12 px-6 border-2 border-navy font-display uppercase tracking-wider font-semibold">Free quote</Link>
      </div>
    </div>
  );
}
