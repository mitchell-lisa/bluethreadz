type GqlError = { message: string };

export function shopifyConfigured() {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN);
}

/** Server-only Storefront API call. POST responses are not cached by Next, so callers wrap reads in unstable_cache. */
export async function storefront<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (!domain || !token) {
    throw new Error("Shopify Storefront API is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN.");
  }
  const version = process.env.SHOPIFY_API_VERSION || "2025-01";
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Shopify Storefront request failed (${res.status}).`);
  }
  const json = (await res.json()) as { data?: T; errors?: GqlError[] };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) throw new Error("Shopify Storefront returned no data.");
  return json.data;
}
