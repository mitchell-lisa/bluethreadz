import Link from "next/link";
import { Section } from "./Section";
import { SHOP_STORES } from "@/lib/stores";
import { safeShopIndex, storeCounts } from "@/lib/shopify/catalog";

export async function ShopByOrg({ heading = true }: { heading?: boolean }) {
  const index = await safeShopIndex();
  const counts = index ? storeCounts(index) : null;

  const grid = (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SHOP_STORES.map((store) => {
        const count = counts?.[store.handle];
        return (
          <li key={store.handle}>
            <Link href={`/shop/${store.handle}`} className="group flex flex-col h-full bg-white border border-line hover:border-navy">
              <div className="px-5 py-5 text-white min-h-28 flex flex-col justify-between" style={{ background: store.band }}>
                <span className="font-display uppercase tracking-[0.18em] text-[11px] font-semibold text-white/80">{store.eyebrow}</span>
                <span className="mt-4 font-display font-bold text-3xl leading-none">{store.short}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="font-display font-bold uppercase tracking-tight text-xl text-navy group-hover:text-thread">{store.name}</p>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed flex-1">{store.blurb}</p>
                <p className="mt-4 text-sm font-semibold text-navy">
                  {typeof count === "number" ? `${count} product${count === 1 ? "" : "s"}` : store.status}
                </p>
                <p className="mt-1 font-display uppercase tracking-wider text-xs font-semibold text-thread">{store.status}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  if (!heading) return grid;

  return (
    <Section
      id="stores"
      eyebrow="Community storefronts"
      title="Shop by organization"
      intro="Each team and school keeps its own shop. They all check out in one cart."
    >
      {grid}
    </Section>
  );
}
