"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CartButton() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = (await res.json()) as { cart: { totalQuantity: number } | null };
        if (!cancelled) setCount(data.cart?.totalQuantity ?? 0);
      } catch {
        if (!cancelled) setCount(0);
      }
    }
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("cart:updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("cart:updated", onUpdate);
    };
  }, []);

  const label = count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart";

  return (
    <Link
      href="/cart"
      aria-label={label}
      className="relative inline-flex items-center justify-center h-11 min-w-11 px-2.5 border border-line text-navy hover:border-navy shrink-0"
    >
      <BagIcon />
      <span className="ml-1.5 hidden lg:inline font-display uppercase tracking-wider text-[13px] font-semibold">Cart</span>
      {count ? (
        <span className="ml-1.5 inline-flex min-w-5 h-5 items-center justify-center bg-thread text-white text-[11px] font-semibold px-1">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" strokeLinecap="round" />
    </svg>
  );
}
