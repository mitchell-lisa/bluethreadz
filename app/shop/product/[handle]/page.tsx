import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Contact } from "@/components/Contact";
import { StickyBar } from "@/components/StickyBar";
import { QuoteFab } from "@/components/QuoteFab";
import { ShopBuyBox } from "@/components/ShopBuyBox";
import { ShopProductCard } from "@/components/ShopProductCard";
import { business } from "@/lib/business";
import { cardBySlug, cardsForStore, getShopIndex, getShopProduct } from "@/lib/shopify/catalog";
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

  const related = product.storeHandle
    ? cardsForStore(index, product.storeHandle).filter((c) => c.slug !== product.slug).slice(0, 4)
    : [];

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
      <main className="pb-14 sm:pb-0">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="mx-auto max-w-6xl px-5 pt-6">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
            <ol className="flex flex-wrap gap-x-2">
              <li><Link href="/" className="hover:text-navy">Home</Link></li>
              <li className="flex gap-x-2"><span aria-hidden>/</span><Link href="/shop" className="hover:text-navy">Team stores</Link></li>
              {product.storeHandle && product.storeName && (
                <li className="flex gap-x-2">
                  <span aria-hidden>/</span>
                  <Link href={`/shop/${product.storeHandle}`} className="hover:text-navy">{product.storeName}</Link>
                </li>
              )}
              <li className="flex gap-x-2"><span aria-hidden>/</span><span>{product.title}</span></li>
            </ol>
          </nav>
        </div>

        <div className="mx-auto max-w-6xl px-5 py-8 md:py-12">
          <ShopBuyBox product={product} />
          {product.descriptionHtml ? (
            <div
              className="mt-12 max-w-3xl text-ink-soft leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_p]:my-3"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.descriptionHtml) }}
            />
          ) : null}
        </div>

        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-5 pb-16">
            <h2 className="font-display font-bold uppercase text-2xl tracking-tight mb-6">More from {product.storeName}</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {related.map((p) => (
                <li key={p.id}><ShopProductCard product={p} /></li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
    </>
  );
}
