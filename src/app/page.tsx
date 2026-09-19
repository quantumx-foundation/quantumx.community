import Image from "next/image";
import Link from "next/link";
import { CircuitStrip } from "@/components/animations";
import { ChapterGrid, StartChapterBanner } from "@/components/chapters";
import { EventRow, EventTableHead } from "@/components/event-row";
import { EventSupportPanel } from "@/components/event-support";
import { NewsCard } from "@/components/news-card";
import { PhotoStrip } from "@/components/photo-strip";
import { PixelLogo } from "@/components/pixel-logo";
import { Programs } from "@/components/programs";
import { SpeakerGrid } from "@/components/speaker-grid";
import { Button, SectionHeading, Stat, Tag, container } from "@/components/ui";
import { isUpcoming, sortedEvents } from "@/content/events";
import { hackathon } from "@/content/hackathon";
import { news } from "@/content/news";
import { speakers } from "@/content/speakers";
import { hosts, proof } from "@/lib/proof";
import {
  DISCORD_URL,
  FOUNDATION_URL,
  SITE_URL,
  chapters,
  formingChapters,
  formingCities,
  listCities,
  liveChapters,
  listNames,
} from "@/lib/site";

// Upcoming vs past is decided at render time; refresh daily.
export const revalidate = 86400;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "QuantumX Community",
  url: SITE_URL,
  logo: `${SITE_URL}/app-icon.png`,
  sameAs: [DISCORD_URL],
  parentOrganization: { "@type": "Organization", name: "QuantumX Foundation", url: FOUNDATION_URL },
  areaServed: chapters.map((c) => c.name),
};

const pillars = [
  {
    title: "Learn it properly.",
    body: "Study circles and workshops that take you from linear algebra to running your own circuits, with no gatekeeping.",
  },
  {
    title: "Build with others.",
    body: "Hackathons, open projects and demo nights, run by each chapter and shared across all of them.",
  },
  {
    title: "Meet the field.",
    body: "Mentors, researchers and speakers from labs, startups and industry, in person and online.",
  },
];

export default function Home() {
  const upcoming = sortedEvents().slice(0, 5);
  const onTheRoad = news.filter((n) => n.kind === "On the road");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section
        className={`${container} grid gap-10 pb-20 pt-12 sm:gap-12 sm:pt-20 md:grid-cols-2 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]`}
      >
        <h1 className="md:col-span-2 lg:col-span-1">
          <span className="sr-only">QuantumX Community, global</span>
          <span aria-hidden>
            <PixelLogo />
          </span>
        </h1>
        <div>
          <p className="text-xl leading-snug">
            A global community for people learning, researching and building quantum technology.
          </p>
          <p aria-hidden className="mt-6 font-pixel text-2xl text-pink">
            ↓
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-6 text-muted">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider">Live in</dt>
              <dd className="mt-1 text-lg text-fg">{listNames(liveChapters)}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider">Next</dt>
              <dd className="mt-1 text-fg">{listNames(formingChapters)}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-xl leading-snug">
            Free and open to students, researchers and builders.
            <span className="text-muted"> Everything starts on Discord.</span>
          </p>
          <div className="mt-8 flex flex-col items-start gap-4">
            <Button href={DISCORD_URL}>Join the Discord</Button>
            <Link href="/events" className="font-pixel text-sm uppercase tracking-[0.2em] text-muted hover:text-pink">
              See upcoming events →
            </Link>
          </div>
        </div>
      </section>

      <CircuitStrip />

      {/* Proof */}
      <section aria-label="Community in numbers" className={`${container} py-20`}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {proof.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Events */}
      <section aria-labelledby="events-title" className={`${container} py-16`}>
        <SectionHeading id="events-title" href="/events" linkLabel="All events">
          Next up
        </SectionHeading>
        <div className="mt-12">
          <EventTableHead />
          {upcoming.map((event) => (
            <EventRow key={event.title} event={event} upcoming={isUpcoming(event.date)} />
          ))}
        </div>
      </section>

      {/* Event support */}
      <EventSupportPanel />

      {/* Moments */}
      <section aria-labelledby="moments-title" className="py-20">
        <div className={container}>
          <h2 id="moments-title" className="text-4xl tracking-tight sm:text-5xl">
            In the room
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Workshops, meetups and hackathons from the last year. Hover for colour.
          </p>
        </div>
        <div className="mt-12">
          <PhotoStrip />
        </div>
      </section>

      {/* Pillars */}
      <section className={`${container} grid gap-12 py-24 md:grid-cols-3`}>
        {pillars.map((item) => (
          <div key={item.title}>
            <h2 className="text-lg">{item.title}</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </section>

      {/* Chapters */}
      <section aria-labelledby="chapters-title" className={`${container} py-16`}>
        <SectionHeading
          id="chapters-title"
          href="/chapters"
          linkLabel="All chapters"
          aside={
            <p className="font-mono text-sm text-muted md:order-last md:w-full">
              {liveChapters.length} live · {formingChapters.length} forming
            </p>
          }
        >
          Chapters
        </SectionHeading>
        <p className="mt-4 max-w-2xl text-muted">
          India is live, and its cities are opening up one by one:{" "}
          <Link href="/chapters/apply" className="text-pink underline decoration-dotted underline-offset-4 hover:text-fg">
            {listCities(formingCities)} are looking for leads
          </Link>
          .
        </p>
        <div className="mt-12">
          <ChapterGrid />
        </div>
      </section>

      {/* On the road */}
      <section aria-labelledby="road-title" className={`${container} py-24`}>
        <SectionHeading id="road-title" href="/news" linkLabel="All news">
          Already in the room abroad
        </SectionHeading>
        <p className="mt-4 max-w-2xl text-muted">
          Before a chapter launches, we show up. London, Bristol, Abu Dhabi and Kuala Lumpur are where the next
          chapters started taking shape.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {onTheRoad.slice(0, 3).map((item) => (
            <NewsCard key={item.url} item={item} />
          ))}
        </div>
      </section>

      {/* Flagship */}
      <section aria-labelledby="hack-title" className={`${container} py-16`}>
        <div className="grid border border-line bg-panel lg:grid-cols-[2fr_3fr]">
          <div className="relative aspect-square lg:aspect-auto">
            <Image
              src={hackathon.poster}
              alt="Quantum for Social Good Hackathon poster"
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative p-6 pt-14 sm:p-10 sm:pt-16">
            <div className="absolute left-0 top-0">
              <Tag>Flagship event</Tag>
            </div>
            <p className="font-mono text-sm text-muted">
              {hackathon.date} · {hackathon.venue}
            </p>
            <h2 id="hack-title" className="mt-3 text-3xl tracking-tight sm:text-4xl">
              QX Hack: {hackathon.title}
            </h2>
            <p className="mt-4 max-w-lg text-muted">{hackathon.summary}</p>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
              {hackathon.stats.map((stat) => (
                <Stat key={stat.label} {...stat} />
              ))}
            </div>
            <div className="mt-10">
              <Button href="/hackathon">Explore QX Hack</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section aria-labelledby="speakers-title" className={`${container} py-24`}>
        <SectionHeading id="speakers-title" href="/speakers" linkLabel={`All ${speakers.length} speakers`}>
          Speakers
        </SectionHeading>
        <div className="mt-12">
          <SpeakerGrid items={speakers.slice(0, 12)} />
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className={`${container} scroll-mt-8 py-24`}>
        <Programs />
      </section>

      {/* Hosts */}
      <section aria-labelledby="hosts-title" className={`${container} py-24`}>
        <h2 id="hosts-title" className="text-4xl tracking-tight sm:text-5xl">
          Rooms we&apos;ve been in
        </h2>
        <p className="mt-4 max-w-xl text-muted">Hosts, venues and programmes we&apos;ve run sessions with or joined.</p>
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {hosts.map((host, i) => (
            <li
              key={host.name}
              className={`relative flex min-h-32 items-center justify-center border border-line p-6 text-center text-lg leading-tight ${
                i === 0 ? "text-xl" : ""
              }`}
            >
              {host.note && (
                <span className="absolute left-0 top-0">
                  <Tag>{host.note}</Tag>
                </span>
              )}
              {host.name}
            </li>
          ))}
        </ul>
      </section>

      <StartChapterBanner />
    </>
  );
}
