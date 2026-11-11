import Link from "next/link";
import { business } from "@/lib/business";
import { Stitchwork } from "./Stitchwork";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#f6f3ec] min-h-[calc(100svh-10.5rem)] sm:min-h-0 flex flex-col">
      <div className="absolute inset-0" aria-hidden>
        {business.media.stitchBlue ? (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url(${business.media.stitchBlue})`, backgroundSize: "450px 450px", backgroundPosition: "center", backgroundRepeat: "repeat" }}
          />
        ) : (
          <Stitchwork variant="blue" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(246,243,236,.9)_0%,rgba(246,243,236,.7)_48%,rgba(246,243,236,.4)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-16 md:py-40 text-center flex-1 flex flex-col items-center justify-center">
        <h1 className="font-display font-bold leading-[0.95] tracking-tight text-ink text-balance text-4xl sm:text-6xl md:text-7xl">
          Your teams. One place to shop.
        </h1>
        <div className="mt-10">
          <Link href="/#stores" className="inline-flex items-center justify-center h-14 px-8 w-full sm:w-auto bg-thread text-white font-display uppercase tracking-wider font-bold text-sm hover:bg-navy transition-colors">
            Shop Team Stores
          </Link>
        </div>
      </div>
      <div className="stitch text-thread absolute bottom-0 inset-x-0" />
    </section>
  );
}
