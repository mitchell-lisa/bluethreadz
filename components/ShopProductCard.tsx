import Link from "next/link";
import { priceFrom, shopImage } from "@/lib/shopify/format";
import type { ShopCard } from "@/lib/shopify/types";

export function ShopProductCard({ product }: { product: ShopCard }) {
  const src = shopImage(product.image, 640);
  return (
    <Link href={`/shop/product/${product.slug}`} className="group block">
      <div className="aspect-[3/4] bg-white overflow-hidden border border-line">
        {src ? (
          <img
            src={src}
            alt={product.imageAlt || product.title}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-ink-soft text-sm px-4 text-center">Photo coming</div>
        )}
      </div>
      <div className="mt-3">
        <p className="font-display font-semibold text-navy leading-snug group-hover:text-thread">{product.title}</p>
        <p className="mt-1 text-sm text-ink-soft">{priceFrom(product.minPrice, product.maxPrice, product.currency)}</p>
      </div>
    </Link>
  );
}
