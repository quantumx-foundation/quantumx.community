import type { Metadata } from "next";
import { ChapterGrid, ChapterTable, CityBoard } from "@/components/chapters";
import { NewsCard } from "@/components/news-card";
import { Button, PageHero, Tag, container } from "@/components/ui";
import { news } from "@/content/news";
import {
  DISCORD_URL,
  FNB_URL,
  formingChapters,
  formingCities,
  listCities,
  liveChapters,
  liveCities,
  listNames,
  SWAG_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Chapters",
  description: `QuantumX Community chapters: live in ${listNames(liveChapters)}, forming in ${listNames(formingChapters)}. Find yours or start one.`,
  alternates: { canonical: "/chapters" },
};

const steps = [
  {
    title: "Apply",
    body: "Send the application form. It takes five minutes and tells us where you are and what you want to run.",
  },
  {
    title: "Find two co-leads",
    body: "Chapters run best with three people sharing the work: events, outreach and content.",
  },
  {
    title: "Run a first session",
    body: "A meetup, a study circle or a talk. Small is fine. We help with the format, speakers and promotion, and we cover food, drinks and QuantumX swag for the room.",
  },
  {
    title: "Go live",
    body: "Your chapter gets its flag on this page, a spot on the QuantumX Luma calendar and a line into every other chapter.",
  },
];

const faq = [
  {
    q: "Do I need to be a quantum expert to lead a chapter?",
    a: "No. You need to be organised and curious. The community brings the expertise; your job is to bring people together.",
  },
  {
    q: "Does it cost anything?",
    a: "No. Chapters are free to start and free to join.",
  },
  {
    q: "What does QuantumX cover for chapter events?",
    a: (
      <>
        <a
          href={FNB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg underline decoration-dotted underline-offset-4 hover:text-pink"
        >
          Food and beverages
        </a>{" "}
        for your attendees, and QuantumX{" "}
        <a
          href={SWAG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg underline decoration-dotted underline-offset-4 hover:text-pink"
        >
          swag
        </a>{" "}
        (stickers, badges and tees) to hand out on the day. Share the date and expected headcount with us
        ahead of time and we&apos;ll sort it with you.
      </>
    ),
  },
  {
    q: "Can I start one at my university?",
    a: "Yes. Campus chapters are a great way to start, and many of our events began as campus sessions.",
  },
  {
    q: "My country isn't listed. Can I still start one?",
    a: "Yes. The forming list is where we already have momentum, not a limit. Reach out from anywhere.",
  },
  {
    q: "India is already live. What does a city lead do there?",
    a: `The India chapter exists, but each city runs on its own. If you lead ${listCities(formingCities)} or anywhere else in India, you run the local meetups, study circles and workshops, with the chapter behind you from day one.`,
  },
];

export default function ChaptersPage() {
  const abroad = news.filter((n) => n.kind === "On the road");

  return (
    <>
      <PageHero eyebrow={`${liveChapters.length} live · ${formingChapters.length} forming`} title="One community, many cities">
        QuantumX started in India and is live in {listNames(liveChapters)}. Chapters are forming in{" "}
        {listNames(formingChapters)}, and Indian cities are opening up for leads.
      </PageHero>

      <section className={`${container} py-8`}>
        <ChapterGrid />
      </section>

      <section className={`${container} py-20`}>
        <ChapterTable />
      </section>

      <section aria-labelledby="cities-title" className={`${container} py-16`}>
        <Tag tone="outline">Cities</Tag>
        <h2 id="cities-title" className="mt-6 max-w-3xl text-4xl tracking-tight sm:text-5xl">
          India is live. These cities need a lead.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          A country goes live first, then each city gets someone to run it. {listCities(liveCities)} already
          {liveCities.length === 1 ? " runs" : " run"}; we&apos;re looking for leads in {listCities(formingCities)}.
        </p>
        <div className="mt-12">
          <CityBoard />
        </div>
      </section>

      <section aria-labelledby="abroad-title" className={`${container} py-16`}>
        <h2 id="abroad-title" className="text-4xl tracking-tight sm:text-5xl">
          Where the next chapters come from
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Each forming chapter follows real time spent on the ground: conferences, labs and meetups.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {abroad.map((item) => (
            <NewsCard key={item.url} item={item} />
          ))}
        </div>
      </section>

      <section id="start" aria-labelledby="start-title" className={`${container} scroll-mt-8 py-24`}>
        <Tag>Start a chapter</Tag>
        <h2 id="start-title" className="mt-6 max-w-3xl text-4xl tracking-tight sm:text-6xl">
          Bring QuantumX to your city
        </h2>
        <ol className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title}>
              <p className="font-pixel text-4xl text-pink">0{i + 1}</p>
              <h3 className="mt-4 text-lg">{step.title}</h3>
              <p className="mt-3 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 flex flex-wrap gap-4">
          <Button href="/chapters/apply">Apply to start a chapter</Button>
          <Button href={DISCORD_URL}>Say hello on Discord</Button>
        </div>
      </section>

      <section aria-labelledby="faq-title" className={`${container} py-16`}>
        <h2 id="faq-title" className="text-4xl tracking-tight sm:text-5xl">
          Questions
        </h2>
        <dl className="mt-12">
          {faq.map((item) => (
            <div key={item.q} className="grid gap-3 border-b border-line py-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
              <dt className="text-lg">{item.q}</dt>
              <dd className="text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
