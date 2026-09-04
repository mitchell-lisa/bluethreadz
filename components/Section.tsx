export function Section({
  id,
  eyebrow,
  title,
  intro,
  dark = false,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  dark?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 py-16 md:py-24 ${dark ? "bg-navy text-cloth weave" : ""} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5">
        {(eyebrow || title) && (
          <div className="max-w-2xl mb-10 md:mb-14">
            {eyebrow && (
              <p
                className={`font-display uppercase tracking-[0.2em] text-sm font-semibold mb-3 ${
                  dark ? "text-thread-bright" : "text-thread"
                }`}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display font-bold uppercase leading-[0.95] text-4xl md:text-5xl tracking-tight">
                {title}
              </h2>
            )}
            {intro && (
              <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-cloth/80" : "text-ink-soft"}`}>{intro}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
