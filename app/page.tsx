import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryStrip } from "@/components/CategoryStrip";
import { QuickQuote } from "@/components/QuickQuote";
import { FAQ } from "@/components/FAQ";
import { Methods } from "@/components/Methods";
import { Serve } from "@/components/Serve";
import { Products } from "@/components/Products";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { Quote } from "@/components/Quote";
import { Contact } from "@/components/Contact";
import { StickyBar } from "@/components/StickyBar";
import { QuoteFab } from "@/components/QuoteFab";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-14 sm:pb-0">
        <Hero />
        <QuickQuote />
        <CategoryStrip />
        <Methods />
        <Serve />
        <Work />
        <Process />
        <Products />
        <FAQ />
        <Quote />
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
    </>
  );
}
