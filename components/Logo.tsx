/**
 * The BlueThreadz wordmark, taken from the brand artwork with the background removed and the
 * decoration-method strip cropped off — the methods are set as live text where they are needed.
 * `light` swaps in the white version for navy backgrounds rather than filtering the navy one.
 */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <img
      src={light ? "/logo-light.png" : "/logo.png"}
      alt="Blue Threadz"
      width={2058}
      height={272}
      decoding="async"
      className={`w-auto ${className}`}
    />
  );
}
