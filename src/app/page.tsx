import Image from "next/image";
import Link from "next/link";
import { ChapterGrid, StartChapterBanner } from "@/components/chapters";
import { CrewGrid } from "@/components/crew";
import { DiscordGate } from "@/components/discord-gate";
import { EventCard, EventGrid } from "@/components/event-card";
import { NewsCard } from "@/components/news-card";
import { PhotoStrip } from "@/components/photo-strip";
import { PixelLogo } from "@/components/pixel-logo";
import { Programs } from "@/components/programs";
import { SpeakerGrid } from "@/components/speaker-grid";
import { Button, SectionHeading, Stat, Tag, container } from "@/components/ui";
import { WorldMap } from "@/components/world-map";
import { crew } from "@/content/crew";
import { isUpcoming, sortedEvents } from "@/content/events";
import { hackathon } from "@/content/hackathon";
import { news } from "@/content/news";
import { speakers } from "@/content/speakers";
import { hosts, proof } from "@/lib/proof";
import {
  FOUNDATION_URL,
  SITE_URL,
  chapters,
  formingChapters,
  formingCities,
  listCities,
  liveChapters,
  listNames,
  socials,
} from "@/lib/site";

// Upcoming vs past is decided at render time; refresh daily.
export const revalidate = 86400;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "QuantumX Community",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: socials.map((s) => s.href),
  parentOrganization: { "@type": "Organization", name: "QuantumX Foundation", url: FOUNDATION_URL },
  areaServed: chapters.map((c) => c.name),
};

export default function Home() {
  const upcoming = sortedEvents().slice(0, 3);
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
          <span className="sr-only">QuantumX Community</span>
          <span aria-hidden>
            <PixelLogo />
          </span>
        </h1>
        <div>
          <p className="text-xl leading-snug">
            A global community for people learning, researching and building quantum technology.
          </p>
          <p aria-hidden className="mt-6 font-pixel text-2xl text-purple">
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
            <DiscordGate source="home" />
            <Link href="/events" className="font-pixel text-sm uppercase tracking-[0.2em] text-muted hover:text-purple">
              See upcoming events →
            </Link>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section aria-label="Community in numbers" className={`${container} py-20`}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {proof.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Hosts */}
      <section aria-labelledby="hosts-title" className={`${container} py-16`}>
        <h2 id="hosts-title" className="text-4xl tracking-tight sm:text-5xl">
          Rooms we&apos;ve been in
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Programmes, institutions and venues we&apos;ve hosted with, spoken at or joined.
        </p>
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {hosts.map((host, i) => (
            <li
              key={host.name}
              className={`relative flex min-h-24 items-center justify-center border p-5 text-center leading-tight ${
                i === 0 ? "border-purple text-lg" : "border-line"
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

      {/* Events */}
      <section aria-labelledby="events-title" className={`${container} py-16`}>
        <SectionHeading id="events-title" href="/events" linkLabel="All events">
          Next up
        </SectionHeading>
        <div className="mt-12">
          <EventGrid>
            {upcoming.map((event) => (
              <EventCard key={event.title} event={event} upcoming={isUpcoming(event.date)} />
            ))}
          </EventGrid>
        </div>
        <p className="mt-8 text-muted">
          Running your own quantum event?{" "}
          <Link href="/events/support" className="text-purple underline decoration-dotted underline-offset-4 hover:text-fg">
            We&apos;ll back it with swag, food and a speaker
          </Link>
          .
        </p>
      </section>

      {/* Moments */}
      <section aria-labelledby="moments-title" className="py-20">
        <div className={container}>
          <h2 id="moments-title" className="text-4xl tracking-tight sm:text-5xl">
            In the room
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Workshops, meetups and hackathons from the last year.
          </p>
        </div>
        <div className="mt-12">
          <PhotoStrip />
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
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href="/hackathon">Explore QX Hack</Button>
              <a
                href={hackathon.winnersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-sm uppercase tracking-[0.2em] text-muted hover:text-purple"
              >
                See the winners ↗
              </a>
            </div>
          </div>
        </div>
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
          <Link href="/chapters/apply" className="text-purple underline decoration-dotted underline-offset-4 hover:text-fg">
            {listCities(formingCities)} are looking for leads
          </Link>
          .
        </p>
        <div className="mt-12">
          <WorldMap />
        </div>
        <div className="mt-12">
          <ChapterGrid />
        </div>
      </section>

      {/* Speakers */}
      <section aria-labelledby="speakers-title" className={`${container} py-24`}>
        <SectionHeading id="speakers-title" href="/speakers" linkLabel="All speakers">
          Speakers
        </SectionHeading>
        <div className="mt-12">
          <SpeakerGrid items={speakers.slice(0, 12)} />
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

      {/* Programs */}
      <section id="programs" className={`${container} scroll-mt-8 py-24`}>
        <Programs />
      </section>

      {/* Crew: back once there are enough faces to fill the grid */}
      {crew.length >= 8 && (
        <section aria-labelledby="crew-title" className={`${container} py-24`}>
          <SectionHeading id="crew-title" href="/crew" linkLabel="Meet the crew">
            The crew
          </SectionHeading>
          <p className="mt-4 max-w-xl text-muted">
            The volunteers who set up the room, look after speakers and make every event happen. Help at one near you
            and your face goes up here.
          </p>
          <div className="mt-12">
            <CrewGrid items={crew.slice(0, 11)} />
          </div>
        </section>
      )}

      {/* Play */}
      <p className={`${container} py-8 text-muted`}>
        Got two minutes?{" "}
        <Link href="/play" className="text-purple underline decoration-dotted underline-offset-4 hover:text-fg">
          Play Qubit Blaster
        </Link>
        , a tiny arcade game about qubits.
      </p>

      <StartChapterBanner />
    </>
  );
}
