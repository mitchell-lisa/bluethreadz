"use client";

import { FormEvent, useState } from "react";
import { business } from "@/lib/business";
import { Section } from "./Section";

const inputCls =
  "w-full h-12 px-4 bg-white border border-line focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20 text-ink";
const labelCls = "block font-display uppercase tracking-wider text-sm font-semibold text-navy mb-1.5";

export function Quote({ initialItem, initialMethod, initialQty }: { initialItem?: string; initialMethod?: string; initialQty?: string }) {
  const [status, setStatus] = useState<"idle" | "sent" | "noemail">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const lines = [
      `Name: ${f.get("name")}`,
      `Email: ${f.get("email")}`,
      `Phone: ${f.get("phone") || "—"}`,
      `Organization: ${f.get("org") || "—"}`,
      `Item(s): ${f.get("item")}`,
      `Quantity: ${f.get("qty")}`,
      `Method: ${f.get("method") || "Not sure — recommend one"}`,
      `Needed by: ${f.get("date") || "—"}`,
      "",
      `Details:`,
      `${f.get("details") || ""}`,
    ];
    if (business.quoteTo) {
      const subject = encodeURIComponent(`Quote request — ${f.get("item")} ×${f.get("qty")}`);
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:${business.quoteTo}?subject=${subject}&body=${body}`;
      setStatus("sent");
    } else {
      setStatus("noemail");
    }
  }

  return (
    <Section
      id="quote"
      eyebrow="Free quote"
      title="Tell us about your order"
      intro="The more you can tell us, the faster we can price it. Don’t have artwork yet? That’s fine — say so and we’ll help."
    >
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5 max-w-3xl">
        <div>
          <label htmlFor="name" className={labelCls}>Your name</label>
          <input id="name" name="name" required autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="org" className={labelCls}>Business / team / group</label>
          <input id="org" name="org" autoComplete="organization" className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
        </div>
        <div>
          <label htmlFor="item" className={labelCls}>What do you need?</label>
          <input id="item" name="item" required defaultValue={initialItem ?? ""} placeholder="e.g. polos, hoodies, caps" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="qty" className={labelCls}>Quantity</label>
            <input id="qty" name="qty" type="number" min={1} required defaultValue={initialQty ?? ""} className={inputCls} />
          </div>
          <div>
            <label htmlFor="date" className={labelCls}>Needed by</label>
            <input id="date" name="date" type="date" className={inputCls} />
          </div>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="method" className={labelCls}>Decoration method</label>
          <select id="method" name="method" className={inputCls} defaultValue={initialMethod ?? ""}>
            <option value="">Not sure — recommend one</option>
            {business.methods.map((m) => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="details" className={labelCls}>Details</label>
          <textarea
            id="details"
            name="details"
            rows={5}
            placeholder="Sizes, colors, where the logo goes, anything else."
            className={`${inputCls} h-auto py-3`}
          />
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center h-14 px-8 bg-thread text-white font-display uppercase tracking-wider font-bold text-base hover:bg-navy transition-colors"
          >
            Send Quote Request
          </button>
          <p className="text-sm text-ink-soft">
            {business.quoteTo
              ? "This opens an email to us with your details filled in. Attach your artwork before sending."
              : "You can also reach us by DM on Instagram."}
          </p>
        </div>
        {status === "sent" && (
          <p role="status" className="md:col-span-2 border-l-4 border-thread pl-4 py-2 text-navy">
            Your email app should have opened with the request. If it didn’t, send the details above to{" "}
            <a className="underline" href={`mailto:${business.quoteTo}`}>{business.quoteTo}</a>.
          </p>
        )}
        {status === "noemail" && (
          <p role="status" className="md:col-span-2 border-l-4 border-thread pl-4 py-2 text-navy">
            Thanks — please send these details to us by DM on{" "}
            <a className="underline" href={business.social.instagram} target="_blank" rel="noopener">
              Instagram @bluethreadz
            </a>{" "}
            while we finish setting up this form.
          </p>
        )}
      </form>
    </Section>
  );
}
