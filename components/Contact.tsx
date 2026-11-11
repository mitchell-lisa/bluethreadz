import Link from "next/link";
import { business } from "@/lib/business";
import { Logo } from "./Logo";

export function Contact() {
  return (
    <footer id="contact" className="scroll-mt-32 bg-navy-deep text-cloth">
      <div className="mx-auto max-w-6xl px-5 py-8 md:py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo light className="h-7" />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/shop" className="hover:text-thread-bright">Team stores</Link>
          <Link href="/products" className="hover:text-thread-bright">Catalog</Link>
          <Link href="/quote" className="hover:text-thread-bright">Quote</Link>
          <a href={business.social.instagram} target="_blank" rel="noopener" className="hover:text-thread-bright">Instagram</a>
        </nav>
      </div>
    </footer>
  );
}
