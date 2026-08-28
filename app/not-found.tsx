import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap section stack" style={{ maxWidth: "52ch" }}>
      <span className="label">404</span>
      <h1 className="h2">That page is not on the rack.</h1>
      <p className="lede">
        The link may be old or the style retired. Search the catalogue or start a quote and tell us
        what you were after.
      </p>
      <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
        <Link href="/products" className="btn btn--ghost">Browse the catalogue</Link>
        <Link href="/quote" className="btn btn--thread">Start a quote</Link>
      </div>
    </div>
  );
}
