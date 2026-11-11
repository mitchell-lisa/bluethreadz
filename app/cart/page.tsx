import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { CartView } from "@/components/CartView";
import { getCart } from "@/lib/shopify/cart";
import { safeShopIndex } from "@/lib/shopify/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart | BlueThreadz",
  description: "Review your BlueThreadz cart. Checkout, tax, and shipping continue on Shopify.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const [cart, index] = await Promise.all([getCart(), safeShopIndex()]);
  const slugs: Record<string, string> = {};
  if (index) {
    for (const card of index.cards) slugs[card.handle] = card.slug;
  }

  return (
    <Shell title="Cart">
      {cart ? (
        <CartView cart={cart} slugs={slugs} />
      ) : (
        <div>
          <p className="text-lg text-ink-soft">Your cart is empty.</p>
          <Link href="/shop" className="mt-6 inline-flex items-center h-12 px-6 bg-navy text-cloth font-display uppercase tracking-wider font-semibold">
            Shop team stores
          </Link>
        </div>
      )}
    </Shell>
  );
}
