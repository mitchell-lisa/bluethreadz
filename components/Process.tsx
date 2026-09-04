import { Section } from "./Section";

const steps = [
  {
    title: "Tell us what you need",
    text: "Garment type, quantity, sizes, your artwork (or your idea), and when you need it.",
  },
  {
    title: "We spec it and quote it",
    text: "We recommend the garment and decoration method, send a proof of your logo placement, and a price.",
  },
  {
    title: "Approve, and we make it",
    text: "Once you sign off on the proof, we produce your order and let you know when it’s ready.",
  },
];

export function Process() {
  return (
    <Section dark eyebrow="How it works" title="Three steps. No runaround.">
      <ol className="grid md:grid-cols-3 gap-8 md:gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="relative pt-6 border-t-2 border-thread-bright">
            <span className="font-display font-bold text-6xl leading-none text-thread-bright/70">{i + 1}</span>
            <h3 className="mt-3 font-display font-bold uppercase text-2xl md:text-3xl leading-none tracking-tight">
              {s.title}
            </h3>
            <p className="mt-3 text-cloth/75 leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
