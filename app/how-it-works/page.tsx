import Link from "next/link";
import type { Metadata } from "next";
import { methods, steps, audiences } from "@/lib/business";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Embroidery, screen print, direct-to-garment, dye sublimation and heat transfer. What each one is good for, and how an order runs.",
};

export default function HowItWorks() {
  return (
    <>
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span>/</span> <span>How it works</span>
        </nav>
        <div className="stack" style={{ maxWidth: "62ch", paddingBottom: "1rem" }}>
          <span className="label">Decoration</span>
          <h1 className="h2">Five methods, and when each one is the right call</h1>
          <p className="lede">
            The method follows the artwork, the fabric and the count, not the other way round.
            Here is the plain version of each.
          </p>
        </div>
      </div>

      <section className="section section--tight">
        <div className="wrap stack" style={{ gap: "0" }}>
          {methods.map((m, i) => (
            <article key={m.slug} id={m.slug} style={{ scrollMarginTop: "88px" }}>
              <hr className="stitch" style={{ margin: "0 0 1.8rem" }} />
              <div className="grid" style={{ gridTemplateColumns: "minmax(0,0.5fr) minmax(0,1fr)", gap: "1.6rem", paddingBottom: "2.2rem" }}>
                <div>
                  <span className="method__no">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="h3" style={{ marginTop: "0.3rem" }}>{m.name}</h2>
                </div>
                <div className="stack">
                  <p style={{ margin: 0, fontSize: "1.02rem", lineHeight: 1.6 }}>{m.blurb}</p>
                  <span className="method__best" style={{ borderTop: 0, paddingTop: 0 }}>Best for: {m.best}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap">
          <span className="label label--onDark">The order</span>
          <h2 className="h2" style={{ margin: "0.5rem 0 1.8rem" }}>How a job runs</h2>
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
          <div style={{ marginTop: "2.2rem" }}>
            <Link href="/quote" className="btn btn--thread">Start a quote</Link>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="wrap stack">
          <span className="label">Who we print for</span>
          <h2 className="h2">Groups that need to look like a group</h2>
          <div className="grid grid--3" style={{ marginTop: "1rem" }}>
            {audiences.map((a) => (
              <div key={a.name} className="method">
                <h3>{a.name}</h3>
                <p>{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
