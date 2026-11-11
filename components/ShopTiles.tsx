import Link from "next/link";
import { SHOP_STORES } from "@/lib/stores";
import { cardsForStore, safeShopIndex } from "@/lib/shopify/catalog";
import { shopImage } from "@/lib/shopify/format";

export async function ShopTiles({ bare = false }: { bare?: boolean }) {
  const index = await safeShopIndex();

  const grid = (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-8">
          {SHOP_STORES.map((store) => {
            const photo = index ? cardsForStore(index, store.handle).find((card) => card.image) : null;
            const src = shopImage(photo?.image, 640);
            return (
              <li key={store.handle}>
                <Link href={`/shop/${store.handle}`} className="group block text-center">
                  <span className="block aspect-square bg-cloth border border-line overflow-hidden">
                    {src ? (
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="grid h-full place-items-center px-3 text-white font-display font-bold text-2xl" style={{ background: store.band }}>
                        {store.short}
                      </span>
                    )}
                  </span>
                  <span className="mt-3 block font-display font-bold text-navy leading-tight group-hover:text-thread">
                    {store.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
  );

  if (bare) return grid;

  return (
    <section id="stores" className="scroll-mt-32 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">{grid}</div>
    </section>
  );
}
