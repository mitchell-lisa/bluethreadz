const SERVICES = [
  "Embroidery",
  "Screen Print",
  "Dye-Sublimation",
  "Heat Transfer",
  "DTG",
  "Custom Apparel",
];

export default function ServicesBand() {
  return (
    <section className="band" aria-label="What we do">
      <ul className="band__list">
        {SERVICES.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  );
}
