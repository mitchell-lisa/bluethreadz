"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeCartLine, updateCartLine } from "@/lib/shopify/actions";
import { displayTitle, formatMoney, shopImage } from "@/lib/shopify/format";
import type { CartView as CartData } from "@/lib/shopify/types";

export function CartView({ cart, slugs }: { cart: CartData; slugs: Record<string, string> }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(lineId: string, fn: () => Promise<{ error?: string } | { cart: unknown }>) {
    setPending(lineId);
    setError(null);
    const result = await fn();
    setPending(null);
    if ("error" in result && result.error) setError(result.error);
    else {
      window.dispatchEvent(new Event("cart:updated"));
      router.refresh();
    }
  }

  if (cart.lines.length === 0) {
    return (
      <div>
        <p className="text-lg text-ink-soft">Your cart is empty.</p>
        <Link href="/shop" className="mt-6 inline-flex items-center h-12 px-6 bg-navy text-cloth font-display uppercase tracking-wider font-semibold">
          Shop team stores
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
      <ul className="divide-y divide-line border-y border-line">
        {cart.lines.map((line) => {
          const href = slugs[line.handle] ? `/shop/product/${slugs[line.handle]}` : "/shop";
          return (
            <li key={line.id} className="py-5 flex gap-3 sm:gap-4">
              <Link href={href} className="h-24 w-20 shrink-0 bg-white border border-line grid place-items-center">
                {line.image ? (
                  <img src={shopImage(line.image, 200) || line.image} alt={line.imageAlt || displayTitle(line.title)} className="h-full w-full object-contain p-1" />
                ) : null}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={href} className="font-display font-semibold text-navy hover:text-thread">{displayTitle(line.title)}</Link>
                {line.options.length > 0 && (
                  <p className="text-sm text-ink-soft mt-1">{line.options.map((o) => `${o.name}: ${o.value}`).join(" · ")}</p>
                )}
                {line.attributes.length > 0 && (
                  <ul className="mt-1 text-sm text-ink-soft">
                    {line.attributes.map((attribute) => (
                      <li key={attribute.key}>
                        {attribute.key}: {attribute.value}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="text-sm text-ink-soft">
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={99}
                      defaultValue={line.quantity}
                      disabled={pending === line.id}
                      onChange={(e) => {
                        const quantity = Number(e.target.value);
                        if (quantity >= 1 && quantity <= 99 && quantity !== line.quantity) {
                          run(line.id, () => updateCartLine(line.id, quantity));
                        }
                      }}
                      className="ml-2 h-11 w-16 px-2 border border-line bg-white"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={pending === line.id}
                    onClick={() => run(line.id, () => removeCartLine(line.id))}
                    className="inline-flex items-center min-h-11 px-1 text-sm underline text-ink-soft hover:text-navy"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-semibold text-navy shrink-0">{formatMoney(line.lineTotal, line.currency)}</p>
            </li>
          );
        })}
      </ul>

      <aside className="border border-navy bg-white p-5">
        <p className="font-display uppercase tracking-[0.18em] text-xs font-semibold text-navy/60">Subtotal</p>
        <p className="mt-2 text-3xl font-semibold text-navy">{formatMoney(cart.subtotal, cart.currency)}</p>
        <a
          href={cart.checkoutUrl}
          className="mt-5 flex items-center justify-center h-12 px-6 bg-thread text-white font-display uppercase tracking-wider font-bold text-sm hover:bg-navy"
        >
          Checkout
        </a>
        {error && <p className="mt-3 text-sm text-ink-soft">{error}</p>}
      </aside>
    </div>
  );
}
