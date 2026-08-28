import Link from "next/link";
import type { Collection } from "@/lib/catalog";
import { business, methods } from "@/lib/business";

export default function Footer({ categories, brands }: { categories: Collection[]; brands: Collection[] }) {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ftr__logo" src="/logo-light.svg" alt="BlueThreadz" width={237} height={30} />
            <p style={{ maxWidth: "34ch", fontSize: "0.94rem", lineHeight: 1.6, margin: 0 }}>
              {business.tagline}. Custom embroidery and printing on apparel, caps and bags.
            </p>
            <Link href="/quote" className="btn btn--thread btn--sm" style={{ marginTop: "1.2rem" }}>
              Start a quote
            </Link>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              {categories.slice(0, 6).map((c) => (
                <li key={c.handle}><Link href={`/products/c/${c.handle}`}>{c.title}</Link></li>
              ))}
              <li><Link href="/products">Everything</Link></li>
            </ul>
          </div>

          <div>
            <h4>Brands</h4>
            <ul>
              {brands.slice(0, 7).map((b) => (
                <li key={b.handle}><Link href={`/products/b/${b.handle}`}>{b.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Decoration</h4>
            <ul>
              {methods.map((m) => (
                <li key={m.slug}><Link href={`/how-it-works#${m.slug}`}>{m.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>More</h4>
            <ul>
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/quote">Get a quote</Link></li>
              <li><a href={business.shopUrl}>Buy blanks online</a></li>
              <li><a href={business.instagram} rel="noopener noreferrer" target="_blank">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="ftr__base">
          <span>© {new Date().getFullYear()} {business.name}</span>
          <span>Checkout for undecorated blanks is handled on bluethreadz.com</span>
        </div>
      </div>
    </footer>
  );
}
