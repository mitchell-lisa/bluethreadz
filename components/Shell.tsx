import Link from "next/link";
import { Header } from "./Header";
import { Contact } from "./Contact";
import { StickyBar } from "./StickyBar";
import { QuoteFab } from "./QuoteFab";

/** Layout for inner pages: header, page header band, content, footer. */
export function Shell({
  crumbs,
  eyebrow,
  title,
  intro,
  children,
}: {
  crumbs?: { href: string; label: string }[];
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pb-14 sm:pb-0">
        <div className="bg-navy text-cloth weave">
          <div className="mx-auto max-w-6xl px-5 pt-8 pb-10 md:pt-12 md:pb-14">
            {crumbs && (
              <nav aria-label="Breadcrumb" className="mb-5 text-sm text-cloth/60">
                <ol className="flex flex-wrap gap-x-2">
                  {crumbs.map((c, i) => (
                    <li key={c.href} className="flex gap-x-2">
                      {i > 0 && <span aria-hidden>/</span>}
                      <Link href={c.href} className="hover:text-cloth">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            {eyebrow && (
              <p className="font-display uppercase tracking-[0.2em] text-sm font-semibold text-thread-bright mb-2">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display font-bold uppercase leading-[0.95] text-4xl md:text-6xl tracking-tight">
              {title}
            </h1>
            {intro && <p className="mt-4 max-w-2xl text-lg text-cloth/80 leading-relaxed">{intro}</p>}
          </div>
          <div className="stitch text-cloth" />
        </div>
        <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">{children}</div>
      </main>
      <Contact />
      <StickyBar />
      <QuoteFab />
    </>
  );
}
