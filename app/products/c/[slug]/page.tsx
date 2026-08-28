import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categories, collectionOf, productsIn } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = collectionOf(slug);
  if (!c) return {};
  return {
    title: `${c.title} for custom decoration`,
    description: `${c.count} ${c.title.toLowerCase()} we embroider and print. Pick one and start a quote.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collectionOf(slug);
  const items = productsIn(slug);
  if (!c || items.length === 0) notFound();

  return (
    <div className="wrap" style={{ paddingBottom: "4rem" }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span>
        <Link href="/products">Catalogue</Link> <span>/</span> <span>{c.title}</span>
      </nav>

      <div className="spread" style={{ marginBottom: "1.4rem" }}>
        <div className="stack">
          <span className="label">{items.length} styles</span>
          <h1 className="h2">{c.title}</h1>
        </div>
        <Link href="/quote" className="btn btn--thread btn--sm">Start a quote</Link>
      </div>

      <hr className="stitch" style={{ margin: "1.6rem 0 2.2rem" }} />

      <div className="grid grid--4">
        {items.map((p) => <ProductCard key={p.handle} p={p} />)}
      </div>
    </div>
  );
}
