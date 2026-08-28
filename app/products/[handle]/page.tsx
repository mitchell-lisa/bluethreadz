import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuyBox from "@/components/BuyBox";
import ProductCard from "@/components/ProductCard";
import { getProduct, products, displayTitle } from "@/lib/catalog";
import { methods } from "@/lib/business";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) return {};
  const t = displayTitle(p);
  return {
    title: t,
    description: `${t}${p.vendor ? ` by ${p.vendor}` : ""}. Available in ${p.colors.length} colours. Embroidered or printed with your logo.`,
    openGraph: { images: p.images[0] ? [`${p.images[0]}&width=1200`] : [] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) notFound();

  const related = products
    .filter((r) => r.slug !== p.slug && r.vendor === p.vendor && r.images.length > 0)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayTitle(p),
    brand: p.vendor || undefined,
    image: p.images.slice(0, 4),
    description: `${displayTitle(p)} available for custom embroidery and printing from BlueThreadz.`,
  };

  return (
    <div className="wrap" style={{ paddingBottom: "4rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span>
        <Link href="/products">Catalogue</Link> <span>/</span>
        <span>{displayTitle(p)}</span>
      </nav>

      <BuyBox p={p} />

      <hr className="stitch" style={{ margin: "3rem 0 2rem" }} />

      <section style={{ marginBottom: "3rem" }}>
        <span className="label">What we can put on it</span>
        <div className="grid grid--3" style={{ marginTop: "1.1rem" }}>
          {methods.slice(0, 3).map((m) => (
            <Link key={m.slug} href={`/how-it-works#${m.slug}`} className="method">
              <h3>{m.name}</h3>
              <p>{m.blurb}</p>
              <span className="method__best">{m.best}</span>
            </Link>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <span className="label">More from {p.vendor}</span>
          <div className="grid grid--4" style={{ marginTop: "1.1rem" }}>
            {related.map((r) => <ProductCard key={r.handle} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
