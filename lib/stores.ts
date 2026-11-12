/**
 * Organization shops in the merged Shopify store, plus BlueThreadz custom
 * apparel (products that are not in any of those collections).
 * Mountainside PAL is not a Shopify collection. Products whose titles start
 * with "(PAL Logo)" are grouped into it in site code.
 * Leftover collections `aces-softball` and `mountainside-fc` are not shops.
 */

export type StoreDef = {
  handle: string;
  name: string;
  short: string;
  eyebrow: string;
  blurb: string;
  status: string;
  band: string;
};

export const TEAM_STORES: StoreDef[] = [
  {
    handle: "rn-threadz",
    name: "RN Threadz",
    short: "RN Threadz",
    eyebrow: "Scrubs and workwear",
    blurb: "Lab coats, scrubs, polos, and everyday workwear for the RN Threadz community.",
    status: "Shop now",
    band: "#022d65",
  },
  {
    handle: "mountainside-fc-1",
    name: "Mountainside FC",
    short: "FC",
    eyebrow: "Club shop",
    blurb: "Player gear and spirit wear for Mountainside FC, from polos to warm ups.",
    status: "Shop now",
    band: "#0d6b45",
  },
  {
    handle: "mountainside-pal",
    name: "Mountainside PAL",
    short: "PAL",
    eyebrow: "PAL shop",
    blurb: "Mountainside PAL gear.",
    status: "Shop now",
    band: "#146c43",
  },
  {
    handle: "st-teresa-of-avila-school-store",
    name: "St. Teresa of Avila",
    short: "School",
    eyebrow: "School store",
    blurb: "Spirit wear and school apparel for St. Teresa of Avila.",
    status: "Shop now",
    band: "#4c2a78",
  },
  {
    handle: "aces-softball-1",
    name: "Aces Softball",
    short: "Softball",
    eyebrow: "League gear",
    blurb: "Jerseys, hoodies, hats, and made to order team gear.",
    status: "Shop now",
    band: "#1d4f91",
  },
];

export const CUSTOM_STORE: StoreDef = {
  handle: "custom-apparel",
  name: "Custom Apparel",
  short: "Custom",
  eyebrow: "BlueThreadz",
  blurb: "Hoodies and pieces made with your artwork. The price includes the decoration package you pick.",
  status: "Made to order",
  band: "#005cfe",
};

export const SHOP_STORES: StoreDef[] = [...TEAM_STORES, CUSTOM_STORE];

/** Shopify collection handles. Mountainside PAL is grouped by title, not a collection. */
export const PAL_HANDLE = "mountainside-pal";

export const TEAM_HANDLES = new Set(TEAM_STORES.map((s) => s.handle).filter((handle) => handle !== PAL_HANDLE));

/** The Nike Club Fleece hoodie sold as a decoration package. */
export const CUSTOM_HOODIE_HANDLE = "bluethreadz-custom-nike-hoodie-adult";

export function storeByHandle(handle: string) {
  return SHOP_STORES.find((s) => s.handle === handle) ?? null;
}
