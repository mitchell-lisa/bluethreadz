import Link from "next/link";
import { business } from "@/lib/business";
import { getProduct, img } from "@/lib/catalog";
import { Section } from "./Section";

// One representative catalog piece per audience.
const PIC: Record<string, string> = {
  "Businesses & Uniforms": "nike-dri-fit-smooth-heather-polo-nkfq4794",
  "Teams & Clubs": "carhartt-midweight-hooded-zip-front-sweatshirt-ctk122",
  "Schools & Spirit Wear": "bella-canvas-womens-triblend-short-sleeve-tee-bc8413",
  "Events & Groups": "richardson-five-panel-champ-trucker-112fpc",
  "High-Visibility & Safety": "cornerstone-ansi-107-class-2-mesh-back-safety-vest-csv405",
};

export function Serve() {
  return (
    <Section id="serve" dark eyebrow="Who we serve" title="From the crew to the whole league">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {business.audiences.map((a) => {
          const p = getProduct(PIC[a.name] ?? "");
          return (
            <li key={a.name} className="group relative bg-navy-deep overflow-hidden min-h-[18rem] flex flex-col">
              {p && (
                <img src={img(p.image, 600)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top opacity-90 transition-transform duration-500 group-hover:scale-105" />
              )}
              <div className="relative mt-auto p-5 bg-gradient-to-t from-navy-deep via-navy-deep/90 to-transparent pt-16">
                <h3 className="font-display font-bold uppercase text-2xl leading-none tracking-tight">{a.name}</h3>
                <p className="mt-2 text-cloth/80 leading-snug text-[15px]">{a.blurb}</p>
                <Link href="/quote" className="mt-3 inline-block font-display uppercase tracking-wider text-sm font-semibold text-thread-bright hover:text-cloth">Get a quote →</Link>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
