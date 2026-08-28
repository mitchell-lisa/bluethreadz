import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { displayTitle } from "@/lib/catalog";

export default function ProductCard({ p }: { p: Product }) {
  const img = p.images[0];
  return (
    <Link href={`/products/${p.slug}`} className="card">
      <span className="card__shot">
        {img ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={`${img}&width=520`} alt={displayTitle(p)} loading="lazy" />
        ) : null}
      </span>
      {p.vendor ? <span className="card__brand">{p.vendor}</span> : null}
      <span className="card__title">{displayTitle(p)}</span>
      <span className="card__meta">
        {p.colors.length > 1 ? `${p.colors.length} colours` : null}
        {p.colors.length > 1 && p.sizes.length > 1 ? " · " : ""}
        {p.sizes.length > 1 ? `${p.sizes.length} sizes` : null}
      </span>
    </Link>
  );
}
