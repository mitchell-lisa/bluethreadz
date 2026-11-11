import { Header } from "./Header";
import { Contact } from "./Contact";
import { StickyBar } from "./StickyBar";
import { QuoteFab } from "./QuoteFab";

/** Compact page frame: a short title, then the content. */
export function Shell({
  title,
  line,
  children,
}: {
  title: string;
  line?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pb-24 sm:pb-0">
        <div className="bg-navy text-cloth">
          <div className="mx-auto max-w-6xl px-5 py-4 md:py-7">
            <h1 className="font-display font-bold leading-none text-2xl md:text-4xl tracking-tight">{title}</h1>
            {line ? <p className="mt-2 max-w-xl text-cloth/80">{line}</p> : null}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 py-4 md:py-8">{children}</div>
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
    </>
  );
}
