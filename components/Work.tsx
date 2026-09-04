import Link from "next/link";
import { business } from "@/lib/business";
import { featured, toCard } from "@/lib/catalog";
import { ProductTile } from "./ProductGrid";
import { Section } from "./Section";

/** Featured styles from the catalog. Replace with real customer-work photos when the shop supplies them. */
export function Work() {
  const items = featured.slice(0, 8);
  return (
    <Section id="work" eyebrow="Featured styles" title="What people are ordering right now" intro="A few of the garments we decorate most. Every one is available with your logo — embroidered or printed.">
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {items.map((p) => (
          <li key={p.handle}><ProductTile p={toCard(p)} /></li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
        <Link href="/products" className="inline-flex items-center justify-center h-12 px-6 border-2 border-navy text-navy font-display uppercase tracking-wider font-semibold hover:bg-navy hover:text-cloth transition-colors">Browse all 1,600+ styles</Link>
        <a href={business.social.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-display uppercase tracking-wider font-semibold text-navy hover:text-thread"><InstagramIcon /> See finished work on Instagram</a>
      </div>
    </Section>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
