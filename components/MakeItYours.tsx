import Link from "next/link";
import { CUSTOM_HOODIE_HANDLE, CUSTOM_STORE } from "@/lib/stores";
import { safeShopIndex } from "@/lib/shopify/catalog";
import { formatMoney, shopImage } from "@/lib/shopify/format";

export async function MakeItYours() {
  const index = await safeShopIndex();
  const hoodie = index?.cards.find((c) => c.handle === CUSTOM_HOODIE_HANDLE) ?? null;
  const src = shopImage(hoodie?.image, 900);
  const href = hoodie ? `/shop/product/${hoodie.slug}` : `/shop/${CUSTOM_STORE.handle}`;

  return (
    <section className="bg-white border-y border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div className="bg-cloth-dark aspect-square grid place-items-center overflow-hidden">
          {src ? (
            <img src={src} alt={hoodie?.imageAlt || "Custom Nike Club Fleece hoodie"} className="h-full w-full object-contain p-6" />
          ) : (
            <p className="text-ink-soft px-6 text-center">Custom Nike Club Fleece hoodie</p>
          )}
        </div>
        <div>
          <p className="font-display uppercase tracking-[0.2em] text-sm font-semibold text-thread mb-3">BlueThreadz custom apparel</p>
          <h2 className="font-display font-bold uppercase leading-[0.95] text-4xl md:text-5xl tracking-tight">Make it yours.</h2>
          <p className="mt-4 text-3xl font-semibold text-navy">One hoodie. Your artwork.</p>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed max-w-xl">
            The Nike Club Fleece hoodie
            {hoodie ? ` starts at ${formatMoney(hoodie.minPrice, hoodie.currency)}` : ""}.
            Pick a decoration package for the front, the sleeve, the back, or a combination. Each location adds to the price.
            BlueThreadz checks placement before it is produced.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={href} className="inline-flex items-center justify-center h-12 px-6 w-full sm:w-auto bg-thread text-white font-display uppercase tracking-wider font-bold text-sm hover:bg-navy">
              Customize a hoodie
            </Link>
            <Link href={`/shop/${CUSTOM_STORE.handle}`} className="inline-flex items-center justify-center h-12 px-6 w-full sm:w-auto border-2 border-navy text-navy font-display uppercase tracking-wider font-semibold hover:bg-navy hover:text-cloth">
              All custom apparel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
