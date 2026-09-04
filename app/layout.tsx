import type { Metadata } from "next";
import { Inter, Tinos } from "next/font/google";
import { business } from "@/lib/business";
import "./globals.css";

const serif = Tinos({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "700"] });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: business.seo.title,
  description: business.seo.description,
  metadataBase: new URL(business.website),
  openGraph: {
    title: business.seo.title,
    description: business.seo.description,
    siteName: business.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: business.seo.title, description: business.seo.description },
};

function jsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    url: business.website,
    sameAs: [business.social.instagram, business.social.facebook].filter(Boolean),
  };
  if (business.phone) data.telephone = business.phone;
  if (business.email) data.email = business.email;
  if (business.address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: "US",
    };
  }
  if (business.serviceArea) data.areaServed = business.serviceArea;
  if (business.yearEstablished) data.foundingDate = String(business.yearEstablished);
  return JSON.stringify(data);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
      </body>
    </html>
  );
}
