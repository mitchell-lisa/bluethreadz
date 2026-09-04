import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Contact } from "@/components/Contact";
import { StickyBar } from "@/components/StickyBar";
import { QuoteFab } from "@/components/QuoteFab";
import { Quote } from "@/components/Quote";

export const metadata: Metadata = {
  title: "Request a Free Quote — BlueThreadz",
  description: "Tell us what you need — garment, quantity, artwork and date — and BlueThreadz will quote it.",
};

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ item?: string; method?: string; qty?: string }> }) {
  const { item, method, qty } = await searchParams;
  return (
    <>
      <Header />
      <main className="pb-14 sm:pb-0">
        <Quote initialItem={item?.slice(0, 200)} initialMethod={method?.slice(0, 40)} initialQty={qty?.replace(/\D/g, "").slice(0, 6)} />
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
    </>
  );
}
