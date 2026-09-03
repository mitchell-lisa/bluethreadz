import Link from "next/link";
import MockupStudio, { type StudioGarment } from "@/components/MockupStudio";
import ServicesBand from "@/components/ServicesBand";
import ProductCard from "@/components/ProductCard";
import { methods, steps, audiences, business } from "@/lib/business";
import {
  categories, brands, products, featured, productsIn, catalogSize, brandCount,
} from "@/lib/catalog";

/** Picks one real product per garment type for the mockup bench. */
function studioGarments(): StudioGarment[] {
  const want: { label: string; collection: string; match: RegExp }[] = [
    { label: "Tee", collection: "tees", match: /t-?shirt|tee/i },
    { label: "Hoodie", collection: "hooded-sweatshirts", match: /hood/i },
    { label: "Polo", collection: "polos-knits", match: /polo|pique/i },
    { label: "Cap", collection: "hats-beanies", match: /cap|hat/i },
    { label: "Bag", collection: "duffel-bags-backpacks", match: /backpack|duffel|bag/i },
  ];

  const out: StudioGarment[] = [];
  for (const w of want) {
    const pool = productsIn(w.collection).filter(
      (p) => w.match.test(p.title) && p.colors.filter((c) => c.image).length >= 5
    );
    // Prefer the one with the widest colour range — more to play with.
    const pick = pool.sort(
      (a, b) => b.colors.filter((c) => c.image).length - a.colors.filter((c) => c.image).length
    )[0];
    if (!pick) continue;
    out.push({
      handle: pick.slug,
      label: w.label,
      title: pick.title,
      colors: pick.colors
        .filter((c): c is { name: string; image: string } => Boolean(c.image))
        .slice(0, 14),
    });
  }
  return out;
}

export default function Home() {
  const garments = studioGarments();
  const picks = featured(8);
  const shelf = picks.length >= 4 ? picks : products.filter((p) => p.images.length).slice(0, 8);

  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="stack">
            <div className="lockup">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lockup__mark" src="/logo.svg" alt="BlueThreadz" width={366} height={46} />
              <span className="lockup__rule" aria-hidden="true" />
              <span className="lockup__tag">&ldquo;{business.tagline}&rdquo;</span>
            </div>
            <h1 className="display">
              Put your logo <em>on it.</em>
            </h1>
            <p className="lede">
              {business.tagline}. Pick a garment, drop your artwork on it, and see the thing before
              you ask anyone for a price. When it looks right, send it over as a quote.
            </p>
            <div className="hero__cta">
              <Link href="/quote" className="btn btn--thread">Start a quote</Link>
              <Link href="/products" className="btn btn--ghost">Browse the catalogue</Link>
            </div>
            <div className="hero__facts">
              <span className="hero__fact">
                <b>{catalogSize.toLocaleString()}</b>
                <span>Blanks to choose from</span>
              </span>
              <span className="hero__fact">
                <b>{brandCount}</b>
                <span>Brands stocked</span>
              </span>
              <span className="hero__fact">
                <b>{methods.length}</b>
                <span>Ways to decorate</span>
              </span>
            </div>
          </div>

          <div>
            {garments.length > 0 ? (
              <MockupStudio garments={garments} />
            ) : (
              <div className="studio" style={{ padding: "2rem" }}>
                <p className="muted">The mockup bench is loading its garments.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ServicesBand />

      <section className="section section--paper">
        <div className="wrap">
          <div className="spread" style={{ marginBottom: "2rem" }}>
            <div className="stack">
              <span className="label">Decoration</span>
              <h2 className="h2">Five ways to get it on the garment</h2>
              <p className="lede">
                Which one is right depends on the artwork, the fabric and how many you need. If you
                are not sure, say so on the quote and we will tell you which we would use.
              </p>
            </div>
            <Link href="/how-it-works" className="btn btn--ghost btn--sm">How it works</Link>
          </div>

          <div className="grid grid--5">
            {methods.map((m, i) => (
              <Link key={m.slug} href={`/how-it-works#${m.slug}`} className="method">
                <span className="method__no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{m.name}</h3>
                <p>{m.blurb}</p>
                <span className="method__best">{m.best}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="spread" style={{ marginBottom: "1.6rem" }}>
            <div className="stack">
              <span className="label">The catalogue</span>
              <h2 className="h2">Start from a blank</h2>
              <p className="lede">
                Everything we decorate starts as a garment from one of these. Pick a category, or
                search the whole {catalogSize.toLocaleString()}-piece catalogue.
              </p>
            </div>
          </div>

          <div className="strip" style={{ marginBottom: "1.4rem" }}>
            {categories.map((c) => (
              <Link key={c.handle} href={`/products/c/${c.handle}`} className="pill">
                {c.title} <span className="mono muted">{c.count}</span>
              </Link>
            ))}
          </div>

          <hr className="stitch" style={{ margin: "2rem 0" }} />

          <div className="grid grid--4">
            {shelf.map((p) => (
              <ProductCard key={p.handle} p={p} />
            ))}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Link href="/products" className="btn btn--ghost">Browse everything</Link>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap">
          <span className="label label--onDark">The order</span>
          <h2 className="h2" style={{ margin: "0.5rem 0 1.8rem" }}>
            From artwork to boxes on your floor
          </h2>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step__n">STEP {String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2.2rem", display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
            <Link href="/quote" className="btn btn--thread">Start a quote</Link>
            <Link href="/how-it-works" className="btn btn--ghostDark">Read the detail</Link>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="wrap">
          <div className="grid grid--2" style={{ gap: "2.6rem", alignItems: "start" }}>
            <div className="stack">
              <span className="label">Who we print for</span>
              <h2 className="h2">Groups that need to look like a group</h2>
              <p className="lede">
                A dozen staff polos and four hundred event tees are the same job at different sizes:
                one piece of artwork, applied consistently, on garments that hold up.
              </p>
              <div className="strip" style={{ marginTop: "0.6rem" }}>
                {audiences.map((a) => (
                  <span key={a.name} className="pill" title={a.note}>{a.name}</span>
                ))}
              </div>
            </div>

            <div className="stack">
              <span className="label">Brands we stock</span>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.4rem" }}>
                {brands.map((b) => (
                  <Link key={b.handle} href={`/products/b/${b.handle}`} className="mega__link">
                    <span>{b.title}</span>
                    <span className="mega__count">{b.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--spool)", color: "var(--paper)" }}>
        <div className="wrap center stack" style={{ justifyItems: "center" }}>
          <span className="label label--onDark">Next step</span>
          <h2 className="h2" style={{ maxWidth: "20ch" }}>Send us the logo. We will send back a price.</h2>
          <p className="lede" style={{ color: "rgba(255,255,255,0.85)", marginInline: "auto" }}>
            Tell us the garment, the rough count and when you need it. A sketch or a photo of an old
            shirt is enough to start.
          </p>
          <Link href="/quote" className="btn btn--onDark" style={{ marginTop: "0.6rem" }}>
            Start a quote
          </Link>
        </div>
      </section>
    </>
  );
}
