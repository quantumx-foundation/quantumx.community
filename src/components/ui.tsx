import Link from "next/link";

export const container = "mx-auto w-full max-w-6xl px-4 sm:px-8";

const buttonClass =
  "inline-flex items-center gap-3 border border-pink px-7 py-4 font-pixel text-sm uppercase tracking-[0.2em] text-pink transition-colors hover:bg-pink hover:text-ink focus-visible:bg-pink focus-visible:text-ink focus-visible:outline-none";

/** Outline pixel button. External hrefs open in a new tab with an ↗. */
export function Button({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        {children}
        <span aria-hidden>↗</span>
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass}>
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

/** Small highlighted pixel label, like Select's "HEADLINE SPONSOR" tag. */
export function Tag({ children, tone = "pink" }: { children: React.ReactNode; tone?: "pink" | "soft" | "outline" }) {
  const tones = {
    pink: "bg-pink text-ink",
    soft: "bg-soft text-ink",
    outline: "border border-dim text-pink",
  };
  return (
    <span className={`inline-block px-2 py-1 font-pixel text-xs uppercase tracking-widest ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** Section title with an optional "see all" link on the right. */
export function SectionHeading({
  id,
  children,
  aside,
  href,
  linkLabel = "See all",
}: {
  id?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 id={id} className="text-4xl tracking-tight sm:text-5xl">
        {children}
      </h2>
      {aside}
      {href && (
        <Link href={href} className="font-pixel text-sm uppercase tracking-[0.2em] text-pink hover:text-fg">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

/** Page intro used by every supporting page. */
export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={`${container} pb-16 pt-16 sm:pt-24`}>
      <Tag>{eyebrow}</Tag>
      <h1 className="mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">{title}</h1>
      {children && <div className="mt-8 max-w-2xl text-xl leading-snug text-muted">{children}</div>}
    </section>
  );
}

/** A big number with a small label, for proof strips. */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-line pl-5">
      <p className="font-pixel text-4xl text-fg sm:text-5xl">{value}</p>
      <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}
