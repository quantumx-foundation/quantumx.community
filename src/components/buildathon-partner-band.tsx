import Image from "next/image";

// Tagged so buildathon visits can be traced back to this band.
const BUILDATHON_URL =
  "https://startupbuildathon.com/?utm_source=quantumx.community&utm_medium=landing_band&utm_campaign=startup_buildathon_2026";

/**
 * Startup Buildathon India 2026 palette, taken from startupbuildathon.com.
 * Kept local: these belong to the event's brand, not to ours.
 */
const SB = {
  bg: "#EEF1F7",
  ink: "#212226",
  inkSoft: "#3C4043",
  muted: "#5F6368",
  line: "#D8DCE3",
  blue: "#3186FF",
  red: "#FC413D",
  yellow: "#FEC700",
  green: "#00AF57",
  cta: "#1A73E8",
};

const ORGANISERS = [
  { name: "Google DeepMind", src: "/logos/buildathon/google-deepmind.svg", w: 188, h: 25 },
  { name: "Google Cloud", src: "/logos/buildathon/google-cloud.webp", w: 1910, h: 311 },
];

const POWERED_BY = [
  { name: "Hack2skill", src: "/logos/buildathon/hack2skill.webp", w: 455, h: 172, cls: "h-3.5" },
  { name: "nasscom", src: "/logos/buildathon/nasscom.webp", w: 1000, h: 144, cls: "h-2.5" },
  { name: "HeadStart", src: "/logos/buildathon/headstart.webp", w: 1400, h: 219, cls: "h-2.5" },
];

/**
 * The event's lockup: four shapes and a two-line wordmark, rebuilt in CSS as
 * the official site does. `--lk` is the unit everything scales from.
 */
function BuildathonLockup() {
  const shape = "block size-[calc(var(--lk)*72)]";
  return (
    <span
      className="flex shrink-0 items-center gap-[calc(var(--lk)*20)] [--lk:0.3px]"
      style={{ color: SB.ink }}
    >
      <span aria-hidden className="grid shrink-0 grid-cols-2 gap-[calc(var(--lk)*8.4)]">
        <span className={`${shape} rounded-tl-[calc(var(--lk)*72)]`} style={{ backgroundColor: SB.blue }} />
        <span className={`${shape} rounded-full`} style={{ backgroundColor: SB.red }} />
        <span className={`${shape} rounded-[calc(var(--lk)*16)]`} style={{ backgroundColor: SB.yellow }} />
        <span className={`${shape} rounded-br-[calc(var(--lk)*72)]`} style={{ backgroundColor: SB.green }} />
      </span>
      <span className="flex flex-col font-sans">
        <span className="block whitespace-nowrap font-normal [font-size:calc(var(--lk)*86)] [letter-spacing:calc(var(--lk)*-3.4)] [line-height:calc(var(--lk)*79)]">
          Startup
        </span>
        <span className="block whitespace-nowrap font-medium [font-size:calc(var(--lk)*86)] [letter-spacing:calc(var(--lk)*-3.4)] [line-height:calc(var(--lk)*79)]">
          Buildathon
        </span>
      </span>
    </span>
  );
}

function LogoRow({
  label,
  logos,
}: {
  label: string;
  logos: { name: string; src: string; w: number; h: number; cls?: string }[];
}) {
  return (
    <span className="flex items-center gap-3">
      <span style={{ color: SB.muted }}>{label}</span>
      {logos.map((l) => (
        <Image
          key={l.name}
          src={l.src}
          alt={l.name}
          width={l.w}
          height={l.h}
          className={`${l.cls ?? "h-3"} w-auto`}
        />
      ))}
    </span>
  );
}

/**
 * Compact "ecosystem partner for Startup Buildathon India 2026" strip, in the
 * event's own colours and marks.
 */
export default function BuildathonPartnerBand({
  className = "py-8 sm:py-10",
  inner = "mx-auto w-full max-w-6xl px-4 sm:px-8",
}: {
  className?: string;
  inner?: string;
}) {
  return (
    <section aria-labelledby="buildathon-heading" className={className}>
      <div className={inner}>
        <>
          <div
            className="overflow-hidden rounded-xl border"
            style={{ backgroundColor: SB.bg, borderColor: SB.line }}
          >
            <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
              <span className="sr-only">Startup Buildathon India 2026</span>
              <span aria-hidden>
                <BuildathonLockup />
              </span>
              <span aria-hidden className="hidden h-7 w-px sm:block" style={{ backgroundColor: SB.line }} />
              <div className="min-w-0 flex-1">
                <h2
                  id="buildathon-heading"
                  className="text-sm font-medium leading-snug sm:text-[0.95rem]"
                  style={{ color: SB.ink }}
                >
                  QuantumX is the ecosystem partner for{" "}
                  <span style={{ color: SB.cta }}>Startup Buildathon, Bengaluru</span>.
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: SB.inkSoft }}>
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: SB.red }} />
                  <span className="font-semibold" style={{ color: SB.ink }}>20–21 Nov</span>
                  <span>· City Buildathon · India 2026</span>
                </p>
              </div>
              <a
                href={BUILDATHON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-white transition-[filter] duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: SB.cta }}
              >
                See the buildathon
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>

            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t bg-white/60 px-4 py-2 text-[0.7rem] sm:px-5"
              style={{ borderColor: SB.line }}
            >
              <LogoRow label="With" logos={ORGANISERS} />
              <LogoRow label="Powered by" logos={POWERED_BY} />
            </div>
          </div>
        </>
      </div>
    </section>
  );
}
