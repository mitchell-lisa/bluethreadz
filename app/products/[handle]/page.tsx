import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Contact } from "@/components/Contact";
import { StickyBar } from "@/components/StickyBar";
import { QuoteFab } from "@/components/QuoteFab";
import { ProductBuy } from "@/components/ProductBuy";
import { business } from "@/lib/business";
import { getProduct, img, products } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const p = getProduct((await params).handle);
  if (!p) return {};
  const title = `${p.title} | Custom Embroidered or Printed | BlueThreadz`;
  const description = `${p.vendor} ${p.title}${p.style ? ` (${p.style})` : ""}. Request a quote from BlueThreadz.`;
  return { title, description, openGraph: { title, description, images: [{ url: img(p.image, 1200) }] } };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) notFound();

  const quoteHref = `/quote?item=${encodeURIComponent(`${p.vendor} ${p.title}${p.style ? ` (${p.style})` : ""}`)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    brand: { "@type": "Brand", name: p.vendor },
    sku: p.style ?? undefined,
    image: p.images.map((s) => img(s, 1200)),
    description: p.intro,
    url: `${business.website}/products/${p.slug}`,
    offers: p.minPrice != null ? { "@type": "AggregateOffer", lowPrice: p.minPrice, priceCurrency: "USD", url: p.shopifyUrl } : undefined,
  };

  return (
    <>
      <Header />
      <main className="pb-24 sm:pb-0">
        <div className="mx-auto max-w-6xl px-5 py-5 md:py-10">
          <ProductBuy p={p} quoteHref={quoteHref} />
        </div>
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
