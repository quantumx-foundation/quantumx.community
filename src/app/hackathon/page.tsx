import type { Metadata } from "next";
import Image from "next/image";
import { Button, PageHero, Stat, Tag, container } from "@/components/ui";
import { hackathon } from "@/content/hackathon";

export const metadata: Metadata = {
  title: "QX Hack",
  description:
    "QX Hack, the Quantum for Social Good Hackathon: 200+ hackers, 50+ teams and 10 hours building quantum MVPs at Startup Park Bengaluru.",
  alternates: { canonical: "/hackathon" },
};

export default function HackathonPage() {
  return (
    <>
      <PageHero eyebrow={`Flagship · ${hackathon.date}`} title={`QX Hack: ${hackathon.title}`}>
        {hackathon.summary}
      </PageHero>

      <section className={`${container} grid grid-cols-2 gap-x-6 gap-y-10 pb-16 md:grid-cols-4`}>
        {hackathon.stats.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </section>

      <div className="relative h-56 sm:h-96">
        <Image
          src={hackathon.banner}
          alt="Startup Park Bengaluru, the venue for QX Hack"
          fill
          preload
          sizes="100vw"
          className="object-cover grayscale contrast-110"
        />
      </div>

      <section aria-labelledby="winners-title" className={`${container} py-24`}>
        <h2 id="winners-title" className="text-4xl tracking-tight sm:text-5xl">
          Winners
        </h2>
        <ol className="mt-12 grid gap-3 md:grid-cols-3 md:gap-4">
          {hackathon.winners.map((team, i) => (
            <li key={team} className="relative border border-line bg-panel p-6 pt-14">
              <span className="absolute left-0 top-0">
                <Tag tone={i === 0 ? "pink" : "soft"}>{["1st", "2nd", "3rd"][i]} place</Tag>
              </span>
              <p className="font-pixel text-3xl">{team}</p>
            </li>
          ))}
        </ol>
        <a
          href={hackathon.winnersUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block font-pixel text-sm uppercase tracking-[0.2em] text-pink hover:text-fg"
        >
          Meet the winning teams ↗
        </a>
      </section>

      <section aria-labelledby="tracks-title" className={`${container} py-16`}>
        <h2 id="tracks-title" className="text-4xl tracking-tight sm:text-5xl">
          Four tracks, one theme
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Every team picked a track and built a working MVP with a real quantum or quantum-inspired component,
          aligned with the UN Sustainable Development Goals.
        </p>
        <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {hackathon.tracks.map((track, i) => (
            <div key={track.title}>
              <p className="font-mono text-sm text-pink">0{i + 1}</p>
              <h3 className="mt-3 text-lg">{track.title}</h3>
              <p className="mt-3 text-muted">{track.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="format-title" className={`${container} py-24`}>
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 id="format-title" className="text-4xl tracking-tight sm:text-5xl">
              Format
            </h2>
            <dl className="mt-10">
              {hackathon.format.map((row) => (
                <div key={row.key} className="grid grid-cols-[8rem_1fr] gap-6 border-b border-line py-5">
                  <dt className="font-mono text-sm uppercase text-muted">{row.key}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-4xl tracking-tight sm:text-5xl">Stack</h2>
            <p className="mt-10 font-mono text-xs uppercase tracking-wider text-muted">Approaches</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {hackathon.approaches.map((item) => (
                <li key={item}>
                  <Tag tone="soft">{item}</Tag>
                </li>
              ))}
            </ul>
            <p className="mt-10 font-mono text-xs uppercase tracking-wider text-muted">Tools teams used</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {hackathon.tools.map((item) => (
                <li key={item}>
                  <Tag tone="outline">{item}</Tag>
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-wrap gap-4">
              <Button href={hackathon.rulesUrl}>Full rules</Button>
              <Button href={hackathon.lumaUrl}>Event page</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
