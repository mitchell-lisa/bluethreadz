import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { categories, brands, products, catalogSize } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Browse the catalogue",
  description:
    "Every blank we decorate: tees, hoodies, polos, caps, bags and workwear from 21 brands.",
};

export default function ProductsHub() {
  const shelf = products.filter((p) => p.images.length > 0).slice(0, 24);

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span> <span>Catalogue</span>
      </nav>

      <div className="stack" style={{ maxWidth: "62ch" }}>
        <span className="label">{catalogSize.toLocaleString()} blanks</span>
        <h1 className="h2">The catalogue</h1>
        <p className="lede">
          Pick anything here and we will decorate it. Browse by what it is, or by who makes it.
          Or hit search if you already know the style number.
        </p>
      </div>

      <hr className="stitch" style={{ margin: "2.4rem 0" }} />

      <section style={{ marginBottom: "3rem" }}>
        <span className="label">By category</span>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", marginTop: "1rem", gap: "0.5rem" }}>
          {categories.map((c) => (
            <Link key={c.handle} href={`/products/c/${c.handle}`} className="mega__link">
              <span>{c.title}</span>
              <span className="mega__count">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <span className="label">By brand</span>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", marginTop: "1rem", gap: "0.5rem" }}>
          {brands.map((b) => (
            <Link key={b.handle} href={`/products/b/${b.handle}`} className="mega__link">
              <span>{b.title}</span>
              <span className="mega__count">{b.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <hr className="stitch" style={{ margin: "2.4rem 0" }} />

      <section style={{ paddingBottom: "4rem" }}>
        <span className="label">A sample of the shelf</span>
        <div className="grid grid--4" style={{ marginTop: "1.2rem" }}>
          {shelf.map((p) => <ProductCard key={p.handle} p={p} />)}
        </div>
      </section>
    </div>
  );
}
