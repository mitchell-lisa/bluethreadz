# BlueThreadz

Marketing and catalogue site for BlueThreadz — custom embroidery and printing on apparel.
Next.js (App Router) with Tailwind CSS.

See `RECOVERY.md` for where this source came from.

## Running it

    npm install
    npm run build     # prebuild pulls the catalogue from bluethreadz.com
    npm start

`npm run dev` starts the dev server. The catalogue is fetched at build time by
`scripts/fetch-catalog.mjs` via the `prebuild` script, which writes `data/catalog.json`
and caches raw responses in `.catalog-cache/`. Both are git-ignored — delete
`.catalog-cache/` to force a fresh pull.

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
