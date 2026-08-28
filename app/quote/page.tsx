import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Start a quote",
  description:
    "Tell us the garment, the count and the artwork. We come back with a price for the run.",
};

export default function QuotePage() {
  return (
    <div className="wrap" style={{ paddingBottom: "5rem" }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span> <span>Quote</span>
      </nav>

      <div className="stack" style={{ maxWidth: "60ch", marginBottom: "2.4rem" }}>
        <span className="label">No obligation</span>
        <h1 className="h2">Start a quote</h1>
        <p className="lede">
          The more you can tell us, the tighter the price comes back. If you are not sure about the
          decoration method, leave it blank. That is our job.
        </p>
      </div>

      <hr className="stitch" style={{ marginBottom: "2.4rem" }} />

      <Suspense fallback={<p className="muted">Loading the form…</p>}>
        <QuoteForm />
      </Suspense>
    </div>
  );
}
