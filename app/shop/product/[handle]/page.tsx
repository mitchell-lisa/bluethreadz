import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Contact } from "@/components/Contact";
import { StickyBar } from "@/components/StickyBar";
import { QuoteFab } from "@/components/QuoteFab";
import { ShopBuyBox } from "@/components/ShopBuyBox";
import { Details } from "@/components/Details";
import { business } from "@/lib/business";
import { cardBySlug, getShopIndex, getShopProduct } from "@/lib/shopify/catalog";
import { sanitizeHtml } from "@/lib/shopify/format";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const index = await getShopIndex();
  const card = cardBySlug(index, handle);
  if (!card) return {};
  const product = await getShopProduct(card.handle);
  if (!product) return {};
  const title = `${product.title} | BlueThreadz`;
  const description = (product.description || `${product.title} from ${product.storeName || "BlueThreadz"}.`).slice(0, 180);
  const image = product.images[0]?.url;
  return { title, description, openGraph: { title, description, images: image ? [{ url: image }] : undefined } };
}

export default async function ShopProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const index = await getShopIndex();
  const card = cardBySlug(index, handle);
  if (!card) notFound();
  const product = await getShopProduct(card.handle);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((i) => i.url),
    description: product.description,
    brand: product.vendor ? { "@type": "Brand", name: product.vendor } : undefined,
    url: `${business.website}/shop/product/${product.slug}`,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: product.minPrice,
      highPrice: product.maxPrice,
      priceCurrency: product.currency,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${business.website}/shop/product/${product.slug}`,
    },
  };

  return (
    <>
      <Header />
      <main className="pb-24 sm:pb-0">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="mx-auto max-w-6xl px-5 py-5 md:py-10">
          <ShopBuyBox product={product} />
          {product.descriptionHtml ? <Details html={sanitizeHtml(product.descriptionHtml)} /> : null}
        </div>
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
    </>
  );
}
