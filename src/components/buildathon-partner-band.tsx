import Image from "next/image";

// Tagged so buildathon visits can be traced back to this band.
const BUILDATHON_URL =
  "https://startupbuildathon.com/?utm_source=quantumx.community&utm_medium=landing_band&utm_campaign=startup_buildathon_2026";

/**
 * Startup Buildathon India 2026 palette, taken from startupbuildathon.com.
 * Kept local: these belong to the event's brand, not to ours.
 */
const SB = {
  bg: "#EEF1F7", // matches the hero art's own background so it blends in
  ink: "#212226",
  inkSoft: "#3C4043",
  muted: "#5F6368",
  blue: "#3186FF",
  red: "#FC413D",
  yellow: "#FEC700",
  green: "#00AF57",
  cta: "#1A73E8",
};

const POWERED_BY = [
  { name: "Hack2skill", src: "/logos/buildathon/hack2skill.webp", w: 455, h: 172, cls: "h-5 sm:h-6" },
  { name: "nasscom", src: "/logos/buildathon/nasscom.webp", w: 1000, h: 144, cls: "h-3.5 sm:h-4" },
  { name: "HeadStart", src: "/logos/buildathon/headstart.webp", w: 1400, h: 219, cls: "h-3.5 sm:h-4" },
];

/**
 * The event's lockup: four shapes and a two-line wordmark. The official site
 * builds it in HTML/CSS rather than shipping an image, so it's rebuilt the
 * same way here. `--lk` is the unit everything scales from.
 */
function BuildathonLockup() {
  const shape = "block size-[calc(var(--lk)*72)]";
  return (
    <span
      className="flex items-start gap-[calc(var(--lk)*24)] [--lk:0.42px] sm:[--lk:0.55px]"
      style={{ color: SB.ink }}
    >
      <span
        aria-hidden
        className="grid shrink-0 grid-cols-2 gap-[calc(var(--lk)*8.4)]"
      >
        <span
          className={`${shape} rounded-tl-[calc(var(--lk)*72)]`}
          style={{ backgroundColor: SB.blue }}
        />
        <span className={`${shape} rounded-full`} style={{ backgroundColor: SB.red }} />
        <span
          className={`${shape} rounded-[calc(var(--lk)*16)]`}
          style={{ backgroundColor: SB.yellow }}
        />
        <span
          className={`${shape} rounded-br-[calc(var(--lk)*72)]`}
          style={{ backgroundColor: SB.green }}
        />
      </span>
      <span className="flex flex-col font-sans">
        <span className="block whitespace-nowrap font-normal [font-size:calc(var(--lk)*86)] [letter-spacing:calc(var(--lk)*-3.4)] [line-height:calc(var(--lk)*79)]">
          Startup
        </span>
        <span className="block whitespace-nowrap font-medium [font-size:calc(var(--lk)*86)] [letter-spacing:calc(var(--lk)*-3.4)] [line-height:calc(var(--lk)*79)]">
          Buildathon
        </span>
        <span
          className="mt-[calc(var(--lk)*14)] flex items-center gap-[calc(var(--lk)*12)] pl-[calc(var(--lk)*5)]"
          style={{ color: SB.inkSoft }}
        >
          <span
            aria-hidden
            className="block h-[calc(var(--lk)*2.5)] w-[calc(var(--lk)*36)]"
            style={{ backgroundColor: SB.inkSoft }}
          />
          <span className="block whitespace-nowrap font-medium [font-size:max(13px,calc(var(--lk)*22))]">
            India 2026
          </span>
        </span>
      </span>
    </span>
  );
}

/**
 * "We're the ecosystem partner for Startup Buildathon India 2026" band,
 * dressed in the event's own branding for credibility: the Google DeepMind
 * and Google Cloud marks, the buildathon lockup, its colours and its art.
 */
export default function BuildathonPartnerBand({
  className = "py-12 sm:py-16",
  inner = "mx-auto w-full max-w-6xl px-4 sm:px-8",
}: {
  className?: string;
  inner?: string;
}) {
  return (
    <section aria-labelledby="buildathon-heading" className={className}>
      <div className={inner}>
                  <div
            className="relative overflow-hidden rounded-2xl border border-[#E3E5E8]"
            style={{ backgroundColor: SB.bg }}
          >
            <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-8 lg:p-14">
              <div className="min-w-0">
                {/* Organisers */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <Image
                    src="/logos/buildathon/google-deepmind.svg"
                    alt="Google DeepMind"
                    width={188}
                    height={25}
                    className="h-[18px] w-auto sm:h-[22px]"
                  />
                  <span aria-hidden className="h-6 w-px bg-[#BDC1C6]" />
                  <Image
                    src="/logos/buildathon/google-cloud.webp"
                    alt="Google Cloud"
                    width={1910}
                    height={311}
                    className="h-[18px] w-auto sm:h-[22px]"
                  />
                </div>

                <p className="mt-9 sm:mt-11">
                  <span className="sr-only">Startup Buildathon India 2026</span>
                  <span aria-hidden>
                    <BuildathonLockup />
                  </span>
                </p>

                <p
                  className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] shadow-sm"
                  style={{ color: SB.cta }}
                >
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: SB.cta }}
                  />
                  Ecosystem Partner
                </p>
                <h2
                  id="buildathon-heading"
                  className="mt-4 max-w-2xl text-balance font-sans text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
                  style={{ color: SB.ink }}
                >
                  QuantumX is the ecosystem partner for{" "}
                  <span style={{ color: SB.cta }}>
                    Startup Buildathon, Bengaluru
                  </span>
                  .
                </h2>
                <p
                  className="mt-4 max-w-xl text-base leading-relaxed sm:text-lg"
                  style={{ color: SB.muted }}
                >
                  Two days taking AI startup ideas from concept to market with
                  Google DeepMind and Google Cloud, Google AI, expert mentors
                  and a community of builders.
                </p>

                <div className="mt-7 flex w-fit items-center gap-4 rounded-2xl border border-[#E3E5E8] bg-white py-3 pl-3 pr-6 shadow-sm">
                  <span
                    aria-hidden
                    className="flex size-14 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#FCE8E6" }}
                  >
                    <Image
                      src="/logos/buildathon/city-bengaluru.svg"
                      alt=""
                      width={68}
                      height={68}
                      className="size-9"
                    />
                  </span>
                  <span className="flex flex-col">
                    <span
                      className="text-lg font-medium leading-tight"
                      style={{ color: SB.ink }}
                    >
                      Bengaluru
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 whitespace-nowrap text-sm" style={{ color: SB.inkSoft }}>
                      <span
                        aria-hidden
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: SB.red }}
                      />
                      <span className="font-semibold" style={{ color: SB.ink }}>
                        20–21 Nov
                      </span>
                      City Buildathon
                    </span>
                  </span>
                </div>

                <a
                  href={BUILDATHON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium text-white transition-[filter,transform] duration-300 ease-out hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                  style={{ backgroundColor: SB.cta }}
                >
                  See the buildathon
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>

              <div className="relative mx-auto w-full max-w-[16rem] sm:max-w-[22rem] lg:max-w-none">
                <Image
                  src="/logos/buildathon/hero-art.webp"
                  alt=""
                  width={806}
                  height={765}
                  sizes="(min-width: 1024px) 416px, 352px"
                  className="h-auto w-full"
                />
              </div>
            </div>

            {/* Event organisers, as listed on the official poster */}
            <div className="flex flex-col gap-6 border-t border-[#E3E5E8] bg-white/60 px-7 py-6 text-sm sm:px-10 lg:flex-row lg:items-center lg:px-14">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <span style={{ color: SB.muted }}>Powered by</span>
                <span className="flex items-center gap-4 sm:gap-5">
                {POWERED_BY.map((p, i) => (
                  <span key={p.name} className="flex items-center gap-4 sm:gap-5">
                    {i > 0 && (
                      <span aria-hidden className="h-5 w-px bg-[#BDC1C6]" />
                    )}
                    <Image
                      src={p.src}
                      alt={p.name}
                      width={p.w}
                      height={p.h}
                      className={`${p.cls} w-auto`}
                    />
                  </span>
                ))}
                </span>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
