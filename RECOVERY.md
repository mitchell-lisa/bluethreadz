# BlueThreadz — recovered source

This is the source of the live site, recovered on 2026-09-04 from the Vercel
deployment `dpl_HRGZhuEVtndn2baPFb1z7KatWAJP` (deployed 25 Aug 2026 by file
upload, never committed to git). All 41 source files were pulled intact.

## What changed

`components/Hero.tsx`, two edits:

1. The headline is on one line. The `<br />` is gone and `whitespace-nowrap`
   was added. Sizes moved from `text-[3rem] sm:text-7xl lg:text-8xl` to
   `text-3xl sm:text-5xl md:text-6xl lg:text-7xl`, because at the old
   `lg:text-8xl` the unbroken line is ~1030px wide and `max-w-4xl` gives it
   856px. Measured one-line ceilings: 80px desktop, 68px at 768, 32px at 390.
   Verified as one line at 1440, 1280, 1024, 820, 768, 640, 430 and 390.

2. The eyebrow now reads Embroidery | Screen Print | Dye-Sublimation |
   Heat Transfer | DTG | Custom Apparel, with tracking reduced from 0.25em to
   0.18em and a smaller starting size so it fits. One line on desktop, two on
   phones.

Nothing else was touched.

## Known pre-existing issue

The desktop nav (`hidden md:flex` in HeaderClient.tsx) overflows horizontally
between 768px and 1024px. This is present on the current production site too,
so it was not introduced here. Worth fixing separately.

## Running it

    npm install
    npm run build     # prebuild pulls the catalogue from bluethreadz.com

`data/catalog.json` is generated, not committed. The last fetch returned 1,610
products, 9 collections, 33 brands.

## Deploy

Connect this repo in Vercel under Settings > Git so pushes deploy on their own.
The project is `bluethreadz` in team `mitchell-lisas-projects`. Until that is
connected, deploys are manual file uploads and the source lives nowhere but
here.
