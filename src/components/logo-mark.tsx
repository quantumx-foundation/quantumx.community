/** QuantumX mark, traced from the foundation's app icon. Inherits `currentColor`. */
export const MARK_VIEWBOX = "117 203 790 618";
export const MARK_PATHS = [
  "M117 203H311L500 392V203H714V607L521 417H117Z",
  "M311 417L503 607H907V821H714L524 631V821H311Z",
];

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} aria-hidden className={className} fill="currentColor">
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
