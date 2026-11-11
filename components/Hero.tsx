import Link from "next/link";
import { business } from "@/lib/business";
import { SHOP_STORES } from "@/lib/stores";
import { safeShopIndex, storeCounts } from "@/lib/shopify/catalog";
import { Stitchwork } from "./Stitchwork";

export async function Hero() {
  const index = await safeShopIndex();
  const counts = index ? storeCounts(index) : null;
  const total = counts ? Object.values(counts).reduce((sum, n) => sum + n, 0) : null;

  return (
    <section id="top" className="relative overflow-hidden bg-[#f6f3ec]">
      <div className="absolute inset-0" aria-hidden>
        {business.media.stitchBlue ? (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url(${business.media.stitchBlue})`, backgroundSize: "450px 450px", backgroundPosition: "center", backgroundRepeat: "repeat" }}
          />
        ) : (
          <Stitchwork variant="blue" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(246,243,236,.88)_0%,rgba(246,243,236,.62)_50%,rgba(246,243,236,.35)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] gap-10 lg:gap-16 items-center">
        <div>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-navy sm:text-xs">
            {business.brandStrip.map((method, i) => (
              <span key={method} className="flex items-center gap-x-2">
                {i > 0 && <span aria-hidden className="text-thread">&bull;</span>}
                {method}
              </span>
            ))}
          </p>

          <h1 className="mt-6 font-display font-bold leading-[0.95] tracking-tight text-ink text-balance text-4xl sm:text-5xl md:text-6xl">
            Your teams. Your brands. One place to shop.
          </h1>
          <p className="mt-4 font-display italic text-xl text-navy">&ldquo;{business.tagline}&rdquo;</p>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-xl">
            Shop Aces Softball, Mountainside FC, RN Threadz, and St. Teresa of Avila from one site. Custom pieces live here too. Decoration on blanks is still quoted the same way.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link href="/#stores" className="inline-flex items-center justify-center h-14 px-8 w-full sm:w-auto whitespace-nowrap bg-thread text-white font-display uppercase tracking-wider font-bold text-sm hover:bg-navy transition-colors">Shop team stores</Link>
            <Link href="/quote" className="inline-flex items-center min-h-11 font-display font-semibold text-navy underline underline-offset-4 decoration-thread/50 hover:decoration-thread">Request a quote</Link>
          </div>

          <ul className="mt-10 grid grid-cols-3 gap-4 max-w-md border-t border-navy/20 pt-6">
            <Stat n="4" l="team stores" />
            <Stat n={total ? String(total) : "487"} l="products" />
            <Stat n="5" l="ways to decorate" />
          </ul>
        </div>

        <ul className="bg-navy text-cloth divide-y divide-white/15 shadow-[0_24px_40px_-24px_rgba(11,37,69,0.55)]">
          {SHOP_STORES.map((store) => (
            <li key={store.handle}>
              <Link href={`/shop/${store.handle}`} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 min-h-11 hover:bg-white/5">
                <span className="min-w-0">
                  <span className="block font-display font-bold text-lg leading-tight">{store.name}</span>
                  <span className="block text-xs uppercase tracking-wider text-white/70 mt-1">
                    {counts ? `${counts[store.handle] ?? 0} products` : store.eyebrow}
                  </span>
                </span>
                <span className="font-display uppercase tracking-wider text-[11px] font-semibold text-thread-bright text-right shrink-0">{store.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="stitch text-thread absolute bottom-0 inset-x-0" />
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <li className="border-l-2 border-thread pl-3">
      <p className="font-display font-bold text-2xl leading-none text-ink">{n}</p>
      <p className="mt-1 text-xs text-ink-soft">{l}</p>
    </li>
  );
}
