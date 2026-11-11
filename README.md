# BlueThreadz

Marketing and catalogue site for BlueThreadz: custom embroidery and printing on apparel.
Next.js (App Router) with Tailwind CSS.

See `RECOVERY.md` for where this source came from.

## Running it

    npm install
    npm run build     # prebuild pulls the catalogue from bluethreadz.com
    npm start

`npm run dev` starts the dev server. Copy `.env.example` to `.env.local` and set
`SHOPIFY_STOREFRONT_TOKEN` before browsing the team stores.

The blank apparel catalogue is snapshotted in `data/catalog.json`. `prebuild` still
tries the public Shopify feed and, if that feed is unavailable, keeps the snapshot.
Team stores, the cart, and checkout use the Shopify Storefront API
(`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`). Do not commit the token.

## Layout

- `app/` — routes: home, products index, product detail, per-category and per-brand
  collections, quote request
- `components/` — header, hero, product grid and buy box, quote form, section chrome
- `lib/` — `business.ts` holds every business fact as a single source of truth;
  `catalog.ts` reads the fetched catalogue
- `public/` — logo artwork

## Deployment

Hosted on Vercel as the `bluethreadz` project, served at `bluethreadz.vercel.app`.
The repository is connected, so a push builds and deploys on its own; `vercel.json`
pins the framework to Next.js. Because the catalogue fetch runs in `prebuild`, every
deploy picks up the current product feed.
