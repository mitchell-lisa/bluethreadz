import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { ProductGrid } from "@/components/ProductGrid";
import { collections, getCollection, productsInCollection, toCard } from "@/lib/catalog";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCollection((await params).slug);
  if (!c) return {};
  return {
    title: `Custom ${c.name} — BlueThreadz`,
    description: `${c.count} ${c.name.toLowerCase()} styles available with custom embroidery or screen printing. Request a quote from BlueThreadz.`,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const items = productsInCollection(slug);

  const brandCounts = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of items) {
    const b = brandCounts.get(p.brandSlug) ?? { slug: p.brandSlug, name: p.vendor, count: 0 };
    b.count++;
    brandCounts.set(p.brandSlug, b);
  }
  const facets = [...brandCounts.values()].sort((a, b) => b.count - a.count);

  return (
    <Shell
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: `/products/c/${slug}`, label: c.name },
      ]}
      eyebrow="Category"
      title={c.name}
      intro={`${c.count} styles. Every one can be embroidered or printed with your logo — pick a few and request a quote.`}
    >
      <ProductGrid items={items.map(toCard)} facetLabel={c.name} facets={{ key: "brandSlug", options: facets }} />
    </Shell>
  );
}
