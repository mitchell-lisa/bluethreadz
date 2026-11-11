import Link from "next/link";

export function HomeQuote() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 text-center">
        <p className="text-lg text-ink">Custom work is still quoted.</p>
        <Link href="/quote" className="mt-6 inline-flex items-center justify-center h-12 px-6 bg-navy text-cloth font-display uppercase tracking-wider font-semibold text-sm hover:bg-thread">
          Free Quote
        </Link>
      </div>
    </section>
  );
}
