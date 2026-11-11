import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ShopTiles } from "@/components/ShopTiles";
import { HomeQuote } from "@/components/HomeQuote";
import { Contact } from "@/components/Contact";
import { StickyBar } from "@/components/StickyBar";
import { QuoteFab } from "@/components/QuoteFab";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-24 sm:pb-0">
        <Hero />
        <ShopTiles />
        <HomeQuote />
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
    </>
  );
}
