"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { methods, placements, business } from "@/lib/business";
import { useThread } from "./ThreadContext";

const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT || "";

type Status = "idle" | "sending" | "sent" | "error";

export default function QuoteForm() {
  const sp = useSearchParams();
  const { thread } = useThread();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    org: "",
    garment: "",
    color: "",
    method: "Not sure yet",
    placement: "Left chest",
    qty: "",
    needBy: "",
    notes: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  // Anything the studio or a product page sent over arrives as query params.
  useEffect(() => {
    setForm((f) => ({
      ...f,
      garment: sp.get("garment") ?? f.garment,
      color: sp.get("color") ?? f.color,
      method: sp.get("method") ?? f.method,
      placement: sp.get("placement") ?? f.placement,
      qty: sp.get("qty") ?? f.qty,
      notes: sp.get("art") ? `Artwork file: ${sp.get("art")}` : f.notes,
    }));
  }, [sp]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const ticket = useMemo(() => {
    const rows: [string, string][] = [
      ["Name", form.name],
      ["Organisation", form.org],
      ["Email", form.email],
      ["Phone", form.phone],
      ["Garment", form.garment],
      ["Colour", form.color],
      ["Method", form.method],
      ["Placement", form.placement],
      ["Thread colour", thread.name],
      ["Quantity", form.qty],
      ["Needed by", form.needBy],
      ["Notes", form.notes],
    ];
    return rows.filter(([, v]) => v && v.trim());
  }, [form, thread]);

  const ticketText = useMemo(
    () => ["BlueThreadz quote request", ...ticket.map(([k, v]) => `${k}: ${v}`)].join("\n"),
    [ticket]
  );

  const ready = form.name.trim() && form.email.trim() && form.qty.trim();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    if (!ENDPOINT) return;
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, threadColour: thread.name, ticket: ticketText }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ticketText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  if (status === "sent") {
    return (
      <div className="ticket" style={{ position: "static", padding: "2rem" }}>
        <span className="label">Quote request sent</span>
        <h2 className="h3" style={{ marginTop: "0.4rem" }}>We have your job ticket.</h2>
        <p className="muted" style={{ margin: 0 }}>
          We will come back to you with a price for the run and confirm the decoration method suits
          the artwork. If you have not attached your logo yet, reply to our email with the file.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid--2" style={{ alignItems: "start", gap: "2.4rem" }}>
      <form className="form" onSubmit={submit}>
        <div className="form__row">
          <label>
            Your name <span className="req">*</span>
            <input value={form.name} onChange={set("name")} required autoComplete="name" />
          </label>
          <label>
            Organisation
            <input value={form.org} onChange={set("org")} autoComplete="organization" placeholder="Team, business or school" />
          </label>
        </div>

        <div className="form__row">
          <label>
            Email <span className="req">*</span>
            <input type="email" value={form.email} onChange={set("email")} required autoComplete="email" />
          </label>
          <label>
            Phone
            <input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
          </label>
        </div>

        <hr className="stitch" />

        <div className="form__row">
          <label>
            Garment
            <input value={form.garment} onChange={set("garment")} placeholder="Tee, hoodie, polo, cap, bag…" />
          </label>
          <label>
            Colour
            <input value={form.color} onChange={set("color")} placeholder="Navy" />
          </label>
        </div>

        <div className="form__row">
          <label>
            Decoration method
            <select value={form.method} onChange={set("method")}>
              <option>Not sure yet</option>
              {methods.map((m) => (
                <option key={m.slug}>{m.name}</option>
              ))}
            </select>
          </label>
          <label>
            Placement
            <select value={form.placement} onChange={set("placement")}>
              {placements.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form__row">
          <label>
            How many pieces <span className="req">*</span>
            <input value={form.qty} onChange={set("qty")} required inputMode="numeric" placeholder="24" />
          </label>
          <label>
            Needed by
            <input type="date" value={form.needBy} onChange={set("needBy")} />
          </label>
        </div>

        <label>
          Anything else
          <textarea
            value={form.notes}
            onChange={set("notes")}
            placeholder="Number of colours in the logo, size runs, names and numbers, a link to your artwork…"
          />
        </label>

        {ENDPOINT ? (
          <>
            <button className="btn btn--thread" type="submit" disabled={!ready || status === "sending"}>
              {status === "sending" ? "Sending…" : "Send quote request"}
            </button>
            {status === "error" && (
              <p className="note">
                That did not go through. Copy the job ticket and send it over on the contact page
                instead. Nothing you typed is lost.
              </p>
            )}
          </>
        ) : (
          <div className="stack">
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button className="btn btn--thread" type="button" onClick={copy}>
                {copied ? "Copied" : "Copy job ticket"}
              </button>
              <a className="btn btn--ghost" href={`${business.shopUrl}/pages/contact`} target="_blank" rel="noopener noreferrer">
                Open the contact page
              </a>
            </div>
            <p className="note">
              Copy the ticket, then paste it into the contact form. Direct submission switches on as
              soon as the quote inbox is set.
            </p>
          </div>
        )}
      </form>

      <aside>
        <div className="ticket">
          <span className="label">Job ticket</span>
          {ticket.length === 0 ? (
            <p className="muted" style={{ margin: "0.4rem 0 0", fontSize: "0.9rem" }}>
              Fill the form and your ticket builds itself here. Anything you set on the mockup bench
              comes across automatically.
            </p>
          ) : (
            ticket.map(([k, v]) => (
              <div className="ticket__row" key={k}>
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
