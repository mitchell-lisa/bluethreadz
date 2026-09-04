import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Contact } from "@/components/Contact";
import { StickyBar } from "@/components/StickyBar";
import { QuoteFab } from "@/components/QuoteFab";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductTile } from "@/components/ProductGrid";
import { business } from "@/lib/business";
import { getCollection, getProduct, img, products, productsInCollection, toCard } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const p = getProduct((await params).handle);
  if (!p) return {};
  const title = `${p.title} — Custom Embroidered or Printed | BlueThreadz`;
  const description = `${p.vendor} ${p.title}${p.style ? ` (${p.style})` : ""} with your logo. ${p.colors.length} colors, sizes ${p.sizes[0] ?? ""}–${p.sizes[p.sizes.length - 1] ?? ""}. Request a quote from BlueThreadz.`;
  return { title, description, openGraph: { title, description, images: [{ url: img(p.image, 1200) }] } };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) notFound();

  const primaryCat = p.categories[0] ? getCollection(p.categories[0]) : null;
  const related = primaryCat
    ? productsInCollection(primaryCat.slug)
        .filter((r) => r.handle !== p.handle)
        .sort((a, b) => (a.vendor === p.vendor ? -1 : 0) - (b.vendor === p.vendor ? -1 : 0))
        .slice(0, 4)
    : [];
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
      <main className="pb-14 sm:pb-0">
        <div className="mx-auto max-w-6xl px-5 pt-6 md:pt-8">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
            <ol className="flex flex-wrap gap-x-2">
              <li><Link href="/products" className="hover:text-navy">Products</Link></li>
              {primaryCat && (
                <li className="flex gap-x-2">
                  <span aria-hidden>/</span>
                  <Link href={`/products/c/${primaryCat.slug}`} className="hover:text-navy">{primaryCat.name}</Link>
                </li>
              )}
              <li className="flex gap-x-2">
                <span aria-hidden>/</span>
                <Link href={`/products/b/${p.brandSlug}`} className="hover:text-navy">{p.vendor}</Link>
              </li>
            </ol>
          </nav>
        </div>

        <div className="mx-auto max-w-6xl px-5 py-6 md:py-10">
          <ProductBuy p={p} quoteHref={quoteHref} />
          <p className="mt-8 text-sm text-ink-soft">
            In:{" "}
            {p.categories.map((s, i) => (
              <span key={s}>{i > 0 && ", "}<Link href={`/products/c/${s}`} className="underline hover:text-navy">{getCollection(s)?.name}</Link></span>
            ))}
          </p>
        </div>

        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-5 pt-6 pb-16 md:pb-20">
            <div className="stitch text-navy mb-10" />
            <h2 className="font-display font-bold uppercase text-2xl md:text-3xl tracking-tight text-navy mb-6">
              More {primaryCat!.name.toLowerCase()}
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {related.map((r) => (
                <li key={r.handle}><ProductTile p={toCard(r)} /></li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
