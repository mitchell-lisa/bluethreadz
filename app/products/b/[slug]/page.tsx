import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { ProductGrid } from "@/components/ProductGrid";
import { brands, getBrand, productsByBrand, toCard } from "@/lib/catalog";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = getBrand((await params).slug);
  if (!b) return {};
  return {
    title: `Custom ${b.name} Apparel — BlueThreadz`,
    description: `${b.count} ${b.name} styles available with custom embroidery or printing from BlueThreadz. Request a quote.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) notFound();
  const items = productsByBrand(slug);

  return (
    <Shell
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: `/products/b/${slug}`, label: b.name },
      ]}
      eyebrow="Brand"
      title={b.name}
      intro={`${b.count} ${b.name} styles we can decorate with your logo.`}
    >
      <ProductGrid items={items.map(toCard)} facetLabel={b.name} />
    </Shell>
  );
}
