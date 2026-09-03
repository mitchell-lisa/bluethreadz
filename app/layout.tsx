import type { Metadata } from "next";
import { Newsreader, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThreadProvider } from "@/components/ThreadContext";
import { categories, brands, catalogSize } from "@/lib/catalog";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bluethreadz.vercel.app"),
  title: {
    default: "BlueThreadz: custom embroidery and printing on apparel",
    template: "%s · BlueThreadz",
  },
  description:
    `Put your logo on it. Embroidery, screen print, direct-to-garment, dye sublimation and heat transfer on ${catalogSize.toLocaleString()} blank garments and bags. Send artwork, get a quote.`,
  icons: { icon: "/mark.svg" },
  openGraph: {
    title: "BlueThreadz: Build your brand in style",
    description:
      "Custom embroidery and printing on apparel, caps and bags. Design it on screen, then send it over for a quote.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>
        <ThreadProvider>
          <a href="#main" className="visually-hidden">Skip to content</a>
          <Header categories={categories} brands={brands} count={catalogSize} />
          <main id="main">{children}</main>
          <Footer categories={categories} brands={brands} />
        </ThreadProvider>
      </body>
    </html>
  );
}
