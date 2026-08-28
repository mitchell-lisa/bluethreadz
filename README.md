# BlueThreadz

Marketing and catalog site for BlueThreadz custom apparel, built with Next.js 15 (App Router) and React 19.

## Getting started

```bash
npm install
npm run dev
```

## Catalog data

The product catalog is pulled from the live BlueThreadz Shopify public JSON feeds at build time by
`scripts/fetch-catalog.mjs`, which runs automatically via the `prebuild` script. It writes
`data/catalog.json` (git-ignored) and caches raw responses in `.catalog-cache/`, so repeat builds
do not re-hit the network. Delete `.catalog-cache/` to force a fresh pull.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Fetch the catalog, then produce a production build |
| `npm start` | Serve the production build |

## Layout

- `app/` — routes: home, products index, product detail, per-category and per-brand collections, quote request, how-it-works
- `components/` — header, footer, search overlay, product card, buy box, mockup studio, quote form
- `lib/` — catalog access helpers and business constants
- `public/` — logo and mark assets
