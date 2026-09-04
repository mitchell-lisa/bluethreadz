import Link from "next/link";
import { business } from "@/lib/business";
import { Stitchwork } from "./Stitchwork";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#f6f3ec]">
      {/* Stitch GIF as full-bleed background */}
      <div className="absolute inset-0" aria-hidden>
        {business.media.stitchBlue ? (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url(${business.media.stitchBlue})`, backgroundSize: "450px 450px", backgroundPosition: "center", backgroundRepeat: "repeat" }}
          />
        ) : (
          <Stitchwork variant="blue" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(246,243,236,.85)_0%,rgba(246,243,236,.55)_45%,rgba(246,243,236,.25)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-24 md:py-36 text-center">
        <img
          src="/logo-lockup.png"
          alt="Blue Threadz — Embroidery, Screen Print, Dye-Sublimation, Heat Transfer, DTG, Custom Apparel"
          width={2172}
          height={724}
          className="mx-auto mb-8 h-auto w-full max-w-2xl"
        />
        <h1 className="font-display font-bold leading-[0.95] tracking-tight text-ink text-balance text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          &ldquo;{business.tagline}&rdquo;
        </h1>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link href="/quote" className="inline-flex items-center justify-center h-14 px-8 whitespace-nowrap bg-thread text-white font-display uppercase tracking-wider font-bold text-sm hover:bg-navy transition-colors">Get a free quote</Link>
          <Link href="/products" className="font-display font-semibold text-navy underline underline-offset-4 decoration-thread/50 hover:decoration-thread whitespace-nowrap">or browse 1,600+ styles &rarr;</Link>
        </div>

        <ul className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto border-t border-navy/20 pt-6 text-left">
          <Stat n="1,600+" l="styles in stock" />
          <Stat n="30+" l="name brands" />
          <Stat n="5" l="decoration methods" />
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
