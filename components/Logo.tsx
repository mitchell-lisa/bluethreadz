/**
 * The BlueThreadz wordmark, cleaned from the supplied artwork (tagline and background removed,
 * upscaled and re-edged). `light` inverts it for navy backgrounds while keeping the spool blue.
 */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <img
      src="/logo.png"
      alt="Blue Threadz"
      width={817}
      height={101}
      decoding="async"
      className={`w-auto ${light ? "invert hue-rotate-180 brightness-110" : ""} ${className}`}
    />
  );
}
