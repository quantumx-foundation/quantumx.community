import type { Metadata } from "next";
import Image from "next/image";
import { EventsBrowser } from "@/components/events-browser";
import { Place } from "@/components/country";
import { PhotoStrip } from "@/components/photo-strip";
import { Button, PageHero, Stat, Tag, container } from "@/components/ui";
import { LUMA_URL, eventCities, events, isUpcoming, sortedEvents } from "@/content/events";
import { EVENTS_EMAIL } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Workshops, meetups, talks and hackathons run or joined by the QuantumX Community across India, the UK and online.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  const items = sortedEvents().map((event) => ({ ...event, upcoming: isUpcoming(event.date) }));
  const next = items.find((e) => e.upcoming);

  return (
    <>
      <PageHero eyebrow="Events" title="Workshops, meetups, talks and hackathons">
        From campus talks in Kerala to research showcases in London. Everything we&apos;ve run, hosted or joined,
        newest first.
      </PageHero>

      <section className={`${container} grid grid-cols-2 gap-x-6 gap-y-10 pb-16 md:grid-cols-4`}>
        <Stat value={String(events.length)} label="Events" />
        <Stat value={String(eventCities.length)} label="Cities" />
        <Stat value={String(events.filter((e) => e.kind === "Workshop").length)} label="Workshops" />
        <Stat value={String(events.filter((e) => e.kind === "Talk").length)} label="Talks" />
      </section>

      {next && (
        <section aria-labelledby="next-title" className={`${container} py-8`}>
          <div className="grid border border-line bg-panel lg:grid-cols-[3fr_2fr]">
            <div className="relative aspect-video lg:aspect-auto lg:min-h-80">
              <Image src={next.image} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
            </div>
            <div className="relative flex flex-col p-6 pt-14 sm:p-10 sm:pt-16">
              <div className="absolute left-0 top-0">
                <Tag>Next up</Tag>
              </div>
              <p className="font-mono text-sm text-pink">{next.displayDate}</p>
              <h2 id="next-title" className="mt-3 text-3xl tracking-tight">
                {next.title}
              </h2>
              <p className="mt-3 text-muted">
                <Place country={next.country} city={next.venue} />
              </p>
              <div className="mt-auto pt-8">
                <Button href={next.url ?? LUMA_URL}>{next.url ? "Register" : "Get notified on Luma"}</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={`${container} py-20`}>
        <EventsBrowser items={items} />
      </section>

      <section className={`${container} py-12`}>
        <div className="flex flex-col gap-8 border border-line p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <Tag tone="soft">Never miss one</Tag>
            <h2 className="mt-4 text-3xl tracking-tight">Follow QuantumX on Luma</h2>
            <p className="mt-3 text-muted">
              Subscribe to the calendar to hear about workshops, meetups and hackathons and RSVP in one tap. Want
              to host one with us? Write to{" "}
              <a href={`mailto:${EVENTS_EMAIL}`} className="text-fg underline decoration-dotted underline-offset-4 hover:text-pink">
                {EVENTS_EMAIL}
              </a>
              .
            </p>
          </div>
          <Button href={LUMA_URL}>View calendar</Button>
        </div>
      </section>

      <section aria-label="Photos from past events" className="py-16">
        <PhotoStrip />
      </section>
    </>
  );
}
