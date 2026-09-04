import { business } from "@/lib/business";
import { Section } from "./Section";

export function Methods() {
  return (
    <Section
      id="methods"
      eyebrow="How we do it"
      title="Five ways to put your name on it"
      intro="Not every logo belongs on every shirt the same way. We’ll tell you which method will look best and last longest for what you’re ordering."
    >
      <div className="grid md:grid-cols-2 gap-x-12">
        {[business.methods.slice(0, 3), business.methods.slice(3)].map((col, ci) => (
          <ol key={ci}>
            {col.map((m, i) => {
              const n = ci * 3 + i + 1;
              return (
                <li key={m.name} className="border-t border-navy/20 py-7 grid grid-cols-[3rem_1fr] gap-4">
                  <span className="font-display font-bold text-thread text-3xl leading-none">0{n}</span>
                  <div>
                    <h3 className="font-display font-bold uppercase text-2xl md:text-3xl leading-none tracking-tight">{m.name}</h3>
                    <p className="mt-3 text-ink-soft leading-relaxed">{m.blurb}</p>
                    <p className="mt-3 font-display uppercase tracking-wider text-sm font-semibold text-navy/70">Best for: {m.bestFor}</p>
                  </div>
                </li>
              );
            })}
            {ci === 1 && (
              <li className="mt-2 py-7 grid grid-cols-[3rem_1fr] gap-4 bg-navy text-cloth px-5 -mx-5 md:mx-0 md:px-6">
                <span className="font-display font-bold text-thread-bright text-3xl leading-none">?</span>
                <div>
                  <h3 className="font-display font-bold uppercase text-2xl md:text-3xl leading-none tracking-tight">Not sure which?</h3>
                  <p className="mt-3 text-cloth/80 leading-relaxed">Send us the garment you have in mind and your artwork. We’ll recommend the method and quote it.</p>
                  <a href="/quote" className="mt-4 inline-flex font-display uppercase tracking-wider font-semibold text-thread-bright hover:text-cloth">Get a recommendation →</a>
                </div>
              </li>
            )}
          </ol>
        ))}
      </div>
    </Section>
  );
}
