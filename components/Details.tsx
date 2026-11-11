"use client";

import { useState } from "react";

export function Details({ html }: { html: string }) {
  const [open, setOpen] = useState(false);
  if (!html.trim()) return null;
  return (
    <div className="mt-8 max-w-3xl">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="min-h-11 font-display uppercase tracking-wider text-sm font-semibold text-navy"
      >
        {open ? "Hide details" : "Details"}
      </button>
      {open ? (
        <div
          className="mt-2 text-ink-soft leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_p]:my-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
    </div>
  );
}
