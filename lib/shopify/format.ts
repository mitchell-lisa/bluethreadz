const PAL_PREFIX = /^\(PAL Logo\)\s*/i;

export function isPalTitle(title: string) {
  return PAL_PREFIX.test(title.trim());
}

/** Shoppers see PAL products without the "(PAL Logo)" prefix. */
export function displayTitle(title: string) {
  return title.trim().replace(PAL_PREFIX, "").replace(/\s+/g, " ").trim();
}

export function shopImage(url: string | null | undefined, width: number) {
  if (!url) return null;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}width=${width}`;
}

export function formatMoney(amount: string | number, currency = "USD") {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
}

export function priceFrom(min: string, max: string, currency: string) {
  const label = formatMoney(min, currency);
  if (Number(min) === Number(max)) return label;
  return `From ${label}`;
}

/** Strip tags and event handlers from Shopify description HTML. */
export function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}
