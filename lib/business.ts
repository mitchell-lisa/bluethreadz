/**
 * BlueThreadz — single source of truth for every business fact on the site.
 *
 * RULE: if a fact is not verified, it is `null` and the site renders nothing for it.
 * Do not guess. Fill in from the owner and the site updates everywhere.
 */

export type Hours = { day: string; open: string; close: string } | { day: string; closed: true };

export const business = {
  name: "BlueThreadz",
  displayName: "Blue Threadz",
  tagline: "Build your brand in style",

  /** The six labels set beneath the wordmark in the brand lockup, in artwork order. */
  brandStrip: ["Embroidery", "Screen Print", "Dye-Sublimation", "Heat Transfer", "DTG", "Custom Apparel"],
  description:
    "Custom embroidered and printed apparel, headwear, bags and workwear for businesses, teams, schools and events. With our design team we can take your concept and make it reality.",

  // ---- Contact (VERIFY WITH OWNER — null renders nothing) ----
  phone: null as string | null, // E.164, e.g. "+18565550100"
  phoneDisplay: null as string | null, // e.g. "(856) 555-0100"
  email: null as string | null, // e.g. "orders@bluethreadz.com"
  address: null as null | {
    street: string;
    city: string;
    state: string;
    zip: string;
    mapsUrl: string;
  },
  hours: null as Hours[] | null,
  serviceArea: null as string[] | null, // e.g. ["South Jersey", "Philadelphia"]
  yearEstablished: null as number | null,

  // ---- Online ----
  website: "https://bluethreadz.com",
  shopUrl: "https://bluethreadz.com/collections/all",
  social: {
    instagram: "https://www.instagram.com/bluethreadz",
    facebook: null as string | null,
  },

  // ---- Decoration methods (verified: listed on current site) ----
  methods: [
    {
      name: "Embroidery",
      blurb:
        "Stitched logos and lettering on polos, hats, jackets and bags. The most durable, most professional finish for uniforms and corporate wear.",
      bestFor: "Polos · Hats · Jackets · Bags",
    },
    {
      name: "Screen Printing",
      blurb:
        "Bold, long-lasting ink for tees, hoodies and event shirts. The right choice for larger runs and simple, high-impact artwork.",
      bestFor: "Tees · Hoodies · Team runs",
    },
    {
      name: "Dye-Sublimation",
      blurb:
        "Full-color, edge-to-edge designs fused into performance fabric. No cracking, no peeling, no texture.",
      bestFor: "Performance wear · All-over prints",
    },
    {
      name: "Heat Transfer",
      blurb:
        "Names, numbers and crisp graphics applied one at a time. Ideal for rosters, small batches and mixed sizes.",
      bestFor: "Names & numbers · Small batches",
    },
    {
      name: "DTG (Direct-to-Garment)",
      blurb:
        "Photographic, full-color detail printed directly onto the garment. Great for complex artwork and short runs.",
      bestFor: "Detailed art · Short runs",
    },
  ],

  // ---- Who they serve (derived from product mix + public Instagram work) ----
  audiences: [
    { name: "Businesses & Uniforms", blurb: "Polos, workwear and outerwear with your logo, ready for the crew." },
    { name: "Teams & Clubs", blurb: "Practice tees, hoodies, caps and bags for sports teams and leagues." },
    { name: "Schools & Spirit Wear", blurb: "Youth and adult sizes, staff shirts and fundraiser-ready runs." },
    { name: "Events & Groups", blurb: "Trips, reunions, bachelorette parties, fundraisers and one-off celebrations." },
    { name: "High-Visibility & Safety", blurb: "ANSI-rated vests, tees and jackets printed with your company name." },
  ],

  // ---- Product categories (verified: current site navigation) ----
  categories: [
    { name: "T-Shirts", href: "https://bluethreadz.com/collections/tees" },
    { name: "Hoodies", href: "https://bluethreadz.com/collections/hooded-sweatshirts" },
    { name: "¼ & ½ Zips", href: "https://bluethreadz.com/collections/1-4-zips" },
    { name: "Polos & Knits", href: "https://bluethreadz.com/collections/polos-knits" },
    { name: "Hats & Beanies", href: "https://bluethreadz.com/collections/hats-beanies" },
    { name: "Bags, Backpacks & Coolers", href: "https://bluethreadz.com/collections/duffel-bags-backpacks" },
    { name: "High-Visibility & Workwear", href: "https://bluethreadz.com/collections/high-visibility-workwear" },
    { name: "Women's", href: "https://bluethreadz.com/collections/ladies" },
    { name: "Youth", href: "https://bluethreadz.com/collections/youth" },
  ],

  // ---- Brands stocked (verified: current site "Shop Brands" menu) ----
  brands: [
    "Nike",
    "Carhartt",
    "The North Face",
    "Eddie Bauer",
    "Champion",
    "New Era",
    "TravisMathew",
    "OGIO",
    "Port Authority",
    "Sport-Tek",
    "BELLA+CANVAS",
    "American Apparel",
    "Next Level",
    "Gildan",
    "Hanes",
    "District",
    "CornerStone",
    "Mercer+Mettle",
    "Port & Company",
    "A4",
  ],

  // ---- Gallery (placeholders until owner supplies photos) ----
  // Replace `src` with real photos in /public/work/. Keep alt honest.
  gallery: [
    { src: null, alt: "Embroidered polos for a local business", label: "Embroidered polos", placeholder: true },
    { src: null, alt: "Screen-printed team hoodies", label: "Team hoodies", placeholder: true },
    { src: null, alt: "Custom caps for a group trip", label: "Custom caps", placeholder: true },
    { src: null, alt: "High-visibility workwear with company logo", label: "Hi-vis workwear", placeholder: true },
    { src: null, alt: "Embroidered duffel bags", label: "Embroidered bags", placeholder: true },
    { src: null, alt: "Dye-sublimated performance shirts", label: "Performance wear", placeholder: true },
  ],

  // ---- Motion (the shop's own cross-stitch GIFs). Paste public URLs; null falls back to the SVG rebuild. ----
  media: {
    stitchBlue: "https://i.pinimg.com/originals/0a/bf/20/0abf2007e1a6fdbb58d5e0ed85744e9f.gif" as string | null, // hero
    stitchMulti: "https://i.pinimg.com/originals/68/2a/ee/682aeef9a5073baad880d017857e71ad.gif" as string | null, // quote section
  },

  // ---- Quote form ----
  // Until an email provider is connected, the form composes an email to `quoteTo`.
  // Set quoteTo to the shop's real email. If null, the form falls back to Instagram DM.
  quoteTo: null as string | null,

  seo: {
    title: "BlueThreadz — Build your brand in style | Custom Embroidery & Printing",
    description:
      "Custom embroidered and printed apparel, hats, bags and workwear for businesses, teams, schools and events. Embroidery, screen print, dye-sublimation, heat transfer and DTG. Request a free quote.",
  },
} as const;

export type Business = typeof business;
