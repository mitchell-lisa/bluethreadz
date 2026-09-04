import { business } from "@/lib/business";
import { InstagramIcon } from "./Work";
import { Logo } from "./Logo";

export function Contact() {
  const b = business;
  return (
    <section id="contact" className="scroll-mt-16 bg-navy-deep text-cloth">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <Logo light className="h-7" />
                    <p className="mt-6 text-cloth/75 leading-relaxed max-w-sm">{b.description}</p>
        </div>

        <div className="md:col-span-7 grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-display uppercase tracking-[0.2em] text-sm font-semibold text-thread-bright mb-3">
              Get in touch
            </h3>
            <ul className="space-y-2 text-lg">
              {b.phone && (
                <li>
                  <a href={`tel:${b.phone}`} className="font-display font-bold text-2xl hover:text-thread-bright">
                    {b.phoneDisplay}
                  </a>
                </li>
              )}
              {b.email && (
                <li>
                  <a href={`mailto:${b.email}`} className="hover:text-thread-bright break-all">{b.email}</a>
                </li>
              )}
              <li>
                <a
                  href={b.social.instagram}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 hover:text-thread-bright"
                >
                  <InstagramIcon /> @bluethreadz
                </a>
              </li>
              <li>
                <a href="/quote" className="font-display uppercase tracking-wider font-semibold text-thread-bright">
                  Request a free quote →
                </a>
              </li>
            </ul>
          </div>

          {(b.address || b.hours || b.serviceArea) && (
            <div>
              {b.address && (
                <>
                  <h3 className="font-display uppercase tracking-[0.2em] text-sm font-semibold text-thread-bright mb-3">
                    Visit
                  </h3>
                  <address className="not-italic text-lg leading-snug">
                    <a href={b.address.mapsUrl} target="_blank" rel="noopener" className="hover:text-thread-bright">
                      {b.address.street}
                      <br />
                      {b.address.city}, {b.address.state} {b.address.zip}
                    </a>
                  </address>
                </>
              )}
              {b.hours && (
                <>
                  <h3 className="mt-6 font-display uppercase tracking-[0.2em] text-sm font-semibold text-thread-bright mb-3">
                    Hours
                  </h3>
                  <ul className="text-cloth/80">
                    {b.hours.map((h) => (
                      <li key={h.day} className="flex justify-between gap-6 max-w-xs">
                        <span>{h.day}</span>
                        <span>{"closed" in h ? "Closed" : `${h.open} – ${h.close}`}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {b.serviceArea && (
                <p className="mt-6 text-cloth/70">Serving {b.serviceArea.join(", ")}.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-cloth/10">
        <div className="mx-auto max-w-6xl px-5 py-5 flex flex-col sm:flex-row justify-between gap-2 text-sm text-cloth/50">
          <p>© {new Date().getFullYear()} {b.name}. All rights reserved.</p>
          <p>Brand names are trademarks of their respective owners.</p>
        </div>
      </div>
    </section>
  );
}
