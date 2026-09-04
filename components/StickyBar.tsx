import { business } from "@/lib/business";

/** Mobile-only bottom bar. Quote always; Call only when a phone number is verified. */
export function StickyBar() {
  const hasPhone = Boolean(business.phone);
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 border-t border-line bg-cloth pb-[env(safe-area-inset-bottom)]">
      {hasPhone ? (
        <a
          href={`tel:${business.phone}`}
          className="h-14 flex items-center justify-center font-display uppercase tracking-wider font-bold text-navy text-lg"
        >
          Call
        </a>
      ) : (
        <a href="/products" className="h-14 flex items-center justify-center font-display uppercase tracking-wider font-bold text-navy text-lg">Catalog</a>
      )}
      <a
        href="/quote"
        className="h-14 flex items-center justify-center font-display uppercase tracking-wider font-bold bg-navy text-cloth text-lg"
      >
        Free Quote
      </a>
    </div>
  );
}
