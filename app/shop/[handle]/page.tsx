import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { StoreBrowser } from "@/components/StoreBrowser";
import { SHOP_STORES, storeByHandle } from "@/lib/stores";
import { cardsForStore, getShopIndex } from "@/lib/shopify/catalog";

export const revalidate = 3600;

export function generateStaticParams() {
  return SHOP_STORES.map((s) => ({ handle: s.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const store = storeByHandle(handle);
  if (!store) return {};
  const title = `${store.name} | BlueThreadz`;
  const description = `${store.blurb} Shop ${store.name} on BlueThreadz.`;
  return { title, description, openGraph: { title, description } };
}

export default async function StorePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const store = storeByHandle(handle);
  if (!store) notFound();

  const index = await getShopIndex();
  const products = cardsForStore(index, store.handle);

  return (
    <Shell
      eyebrow={store.eyebrow}
      title={store.name}
      intro={`${products.length} product${products.length === 1 ? "" : "s"}. ${store.blurb}`}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/shop", label: "Team stores" },
        { href: `/shop/${store.handle}`, label: store.name },
      ]}
    >
      <StoreBrowser products={products} />
    </Shell>
  );
}
