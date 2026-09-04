import { Section } from "./Section";

// Keep answers honest: no minimums, turnaround times or prices are stated, because we haven't verified them.
const faqs = [
  {
    q: "How do I get a price?",
    a: "Send a quote request with the garment, quantity, sizes and your artwork (or your idea). We come back with a recommendation, a proof and a price.",
  },
  {
    q: "I don’t have a logo file. Can you help?",
    a: "Yes. Our design team can work from a sketch, a photo or a description and turn it into artwork that’s ready to stitch or print.",
  },
  {
    q: "Which decoration method should I choose?",
    a: "It depends on the garment and the artwork. Embroidery is the most durable and looks best on polos, hats, jackets and bags. Screen printing suits tees and hoodies in larger runs. Dye-sublimation, heat transfer and DTG cover full-color, small-batch and detailed designs. If you’re not sure, ask — we’ll recommend one.",
  },
  {
    q: "Can I mix sizes and styles in one order?",
    a: "Yes. Tell us the breakdown in your quote request and we’ll price it as one job.",
  },
  {
    q: "Do you carry brands that aren’t in the catalog?",
    a: "Often. If you have a specific brand or style in mind, name it in your request and we’ll let you know.",
  },
];

export function FAQ() {
  return (
    <Section id="faq" eyebrow="Questions" title="Good to know before you order">
      <dl className="grid md:grid-cols-2 gap-x-12">
        {faqs.map((f) => (
          <div key={f.q} className="border-t border-navy/20 py-6">
            <dt className="font-display font-bold uppercase text-xl md:text-2xl leading-none tracking-tight text-navy">{f.q}</dt>
            <dd className="mt-3 text-ink-soft leading-relaxed">{f.a}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
