/**
 * Verified facts only. Anything not confirmed by the owner stays `null`, and
 * every component that reads a `null` renders nothing rather than guessing.
 */

export const business = {
  name: "BlueThreadz",
  tagline: "Build your brand in style",

  // --- Confirmed ---
  shopUrl: "https://bluethreadz.com",
  instagram: "https://www.instagram.com/bluethreadz/",

  // --- Awaiting owner ---
  phone: null as string | null,
  email: null as string | null,
  quoteTo: null as string | null,
  address: null as { street: string; city: string; state: string; zip: string } | null,
  hours: null as { day: string; open: string; close: string }[] | null,
  yearFounded: null as number | null,
  serviceArea: null as string[] | null,
};

export const methods = [
  {
    slug: "embroidery",
    name: "Embroidery",
    blurb:
      "Your logo stitched into the fabric with thread. It does not crack, peel or wash out, and it reads as the most finished of the options.",
    best: "Polos · caps · jackets · bags",
  },
  {
    slug: "screen-print",
    name: "Screen print",
    blurb:
      "Ink pushed through a mesh screen, one screen per colour. The cost per piece drops as the run grows, which makes it the workhorse for bigger orders.",
    best: "Tees · hoodies · event runs",
  },
  {
    slug: "dtg",
    name: "Direct to garment",
    blurb:
      "Ink printed straight onto the shirt like a photo print. No screens to set up, so full-colour artwork and small counts stop being a problem.",
    best: "Full-colour art · short runs",
  },
  {
    slug: "dye-sublimation",
    name: "Dye sublimation",
    blurb:
      "The design is turned into a gas that dyes the fibres themselves. Edge-to-edge colour with nothing sitting on top of the fabric to feel.",
    best: "Jerseys · all-over prints",
  },
  {
    slug: "heat-transfer",
    name: "Heat transfer",
    blurb:
      "Cut or printed film pressed onto the garment. It handles names and numbers cleanly, so a roster of one-offs is straightforward.",
    best: "Names · numbers · one-offs",
  },
] as const;

export const audiences = [
  { name: "Small business", note: "Uniforms and everyday branded gear" },
  { name: "Teams & leagues", note: "Jerseys, warmups, names and numbers" },
  { name: "Schools & clubs", note: "Spirit wear and group orders" },
  { name: "Events", note: "Staff shirts, giveaways, merch" },
  { name: "Trades & crews", note: "Workwear and high-visibility" },
  { name: "Non-profits", note: "Fundraiser and volunteer apparel" },
];

export const steps = [
  {
    title: "Send your artwork",
    body: "Start a quote with what you have: a logo file, a sketch, or a photo of an old shirt. Tell us the garment, the rough count and when you need it.",
  },
  {
    title: "We come back with a quote",
    body: "We confirm the decoration method that suits the artwork and the garment, and price the run against the count you gave us.",
  },
  {
    title: "You approve a proof",
    body: "Nothing goes on a garment until you have seen the placement and size and said yes.",
  },
  {
    title: "We decorate and hand it over",
    body: "Your order is produced and packed. Reorders run off the same approved file.",
  },
];

/** Thread colours for the accent picker. Named the way a thread chart is. */
export const threads = [
  { name: "Athletic Gold", hex: "#f2a900", ink: "#14161c" },
  { name: "Scarlet", hex: "#c8102e", ink: "#ffffff" },
  { name: "Kelly", hex: "#007a33", ink: "#ffffff" },
  { name: "Royal", hex: "#1d4f91", ink: "#ffffff" },
  { name: "Purple", hex: "#582c83", ink: "#ffffff" },
  { name: "Orange", hex: "#ff6a13", ink: "#14161c" },
  { name: "Teal", hex: "#007c91", ink: "#ffffff" },
  { name: "Silver", hex: "#9ea2a2", ink: "#14161c" },
  { name: "White", hex: "#ffffff", ink: "#14161c" },
  { name: "Black", hex: "#14161c", ink: "#ffffff" },
] as const;

export const placements = [
  "Left chest",
  "Full front",
  "Full back",
  "Left sleeve",
  "Right sleeve",
  "Cap front",
  "Nape / collar",
] as const;
