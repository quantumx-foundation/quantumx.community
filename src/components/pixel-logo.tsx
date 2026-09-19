const rows = [
  { text: "QUANTUMX", bg: "bg-pink" },
  { text: "COMMUNITY", bg: "bg-soft" },
  { text: "GLOBAL", bg: "bg-fg" },
];

/** Stacked, highlighted wordmark. */
export function PixelLogo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const text = size === "lg" ? "text-4xl sm:text-5xl" : "text-lg";
  return (
    <div className={`flex flex-col items-start font-pixel leading-none text-ink ${text}`}>
      {rows.map((row) => (
        <span key={row.text} className={`${row.bg} px-1 pt-1 tracking-[0.12em]`}>
          {row.text}
        </span>
      ))}
    </div>
  );
}
