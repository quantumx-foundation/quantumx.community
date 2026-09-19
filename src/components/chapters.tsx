import Link from "next/link";
import { ArrowField } from "./animations";
import { BlankFlag, PixelFlag } from "./pixel-flag";
import { Button, Tag } from "./ui";
import { chapters, formingChapters, formingCities, listNames, type Chapter } from "@/lib/site";

function ChapterCard({ chapter, featured }: { chapter: Chapter; featured?: boolean }) {
  const live = chapter.status === "live";
  return (
    <article
      className={`group relative flex flex-col border border-line bg-panel p-5 pt-12 sm:p-6 sm:pt-14 ${
        featured ? "col-span-2" : ""
      }`}
    >
      <div className="absolute left-0 top-0">
        {live ? <Tag>● Live</Tag> : <Tag tone="outline">Forming</Tag>}
      </div>
      <div className="flex flex-1 items-center justify-center py-4">
        <PixelFlag
          code={chapter.code}
          className={`w-full transition duration-500 ${featured ? "max-w-72" : "max-w-40"} ${
            live ? "" : "opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0"
          }`}
        />
      </div>
      <h3 className="mt-6 text-lg leading-tight">{chapter.name}</h3>
      <p className="mt-1 text-sm text-muted">{chapter.summary}</p>
    </article>
  );
}

/**
 * Closes the grid with a slot for a city we haven't named. India spans two
 * columns, so eight chapters leave a hole at the end of the second row; this
 * fills it and turns it into the invitation.
 */
function OpenChapterCard() {
  return (
    <Link
      href="/chapters/apply"
      className="group scanlines relative flex flex-col border border-line p-5 pt-12 transition-colors hover:border-pink sm:p-6 sm:pt-14"
    >
      <div className="absolute left-0 top-0">
        <Tag tone="outline">Open</Tag>
      </div>
      <div className="flex flex-1 items-center justify-center py-4">
        <BlankFlag className="w-full max-w-40 opacity-70 transition-opacity group-hover:opacity-100" />
      </div>
      <h3 className="mt-6 text-lg leading-tight">Bring your city</h3>
      <p className="mt-1 text-sm text-muted">
        Not on the map yet? Start a chapter where you are.
      </p>
      <span className="mt-3 font-pixel text-xs uppercase tracking-[0.2em] text-pink">Apply &rarr;</span>
    </Link>
  );
}

export function ChapterGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
      {chapters.map((chapter, i) => (
        <ChapterCard key={chapter.code} chapter={chapter} featured={i === 0} />
      ))}
      <OpenChapterCard />
    </div>
  );
}

export function ChapterTable() {
  const row =
    "grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-6 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-x-6 md:grid-cols-[7rem_12rem_minmax(0,1fr)] lg:grid-cols-[8rem_14rem_minmax(0,1fr)]";
  return (
    <div>
      <div className="hidden grid-cols-[7rem_12rem_minmax(0,1fr)] gap-6 border-b border-line pb-4 text-sm uppercase tracking-wider text-muted md:grid lg:grid-cols-[8rem_14rem_minmax(0,1fr)]">
        <span>Status</span>
        <span>Chapter</span>
        <span>What&apos;s happening</span>
      </div>
      {chapters.map((chapter) => (
        <div key={chapter.code} className={`${row} border-b border-line`}>
          <span
            className={`font-mono text-sm uppercase md:pt-1 ${chapter.status === "live" ? "text-pink" : "text-muted"}`}
          >
            {chapter.status}
          </span>
          <span className="text-lg">{chapter.name}</span>
          <p className="col-start-2 text-muted md:col-start-auto md:text-fg">{chapter.summary}</p>
        </div>
      ))}
      <div className={`${row} scanlines -mx-4 px-4 md:-mx-6 md:px-6`}>
        <span className="font-mono text-sm uppercase text-muted md:pt-1">Open</span>
        <span className="text-lg text-muted">Your city</span>
        <p className="col-start-2 text-muted md:col-start-auto">
          Not on the map yet? Start a chapter where you are.{" "}
          <Link href="/chapters/apply" className="text-pink underline decoration-dotted underline-offset-4 hover:text-fg">
            Here&apos;s how
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

const cityCard = "relative flex flex-col border border-line p-5 pt-12 sm:p-6 sm:pt-14";
const cityLink = "mt-5 inline-block font-pixel text-xs uppercase tracking-[0.2em] text-pink hover:text-fg";

/**
 * Cities inside a live chapter that still need a lead of their own, plus an
 * open card for the ones we haven't named.
 */
export function CityBoard() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {formingCities.map((city) => (
        <article key={city.name} className={`${cityCard} bg-panel`}>
          <div className="absolute left-0 top-0">
            <Tag tone="outline">Lead wanted</Tag>
          </div>
          <h3 className="text-2xl tracking-tight">{city.name}</h3>
          <p className="mt-2 text-sm text-muted">
            No lead yet. Take the first meetup and the city is yours to run.
          </p>
          <Link href="/chapters/apply" className={cityLink}>
            Lead {city.name} →
          </Link>
        </article>
      ))}
      <article className={`${cityCard} scanlines`}>
        <div className="absolute left-0 top-0">
          <Tag tone="outline">Open</Tag>
        </div>
        <h3 className="text-2xl tracking-tight text-muted">Any other city</h3>
        <p className="mt-2 text-sm text-muted">
          The named cities are where we have momentum, not a limit. Tell us yours and we&apos;ll start there.
        </p>
        <Link href="/chapters/apply" className={cityLink}>
          Name your city →
        </Link>
      </article>
    </div>
  );
}

/** Arrow-field banner inviting people to lead a forming chapter. */
export function StartChapterBanner({ href = "/chapters/apply" }: { href?: string }) {
  return (
    <section aria-labelledby="start-banner-title" className="relative py-12">
      <ArrowField />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="flex max-w-2xl flex-col items-center gap-5 bg-bg px-5 py-6 text-center sm:gap-6 sm:px-12 sm:py-10">
          <h2 id="start-banner-title" className="text-3xl tracking-tight sm:text-5xl">
            New chapters are forming now
          </h2>
          <p className="max-w-md text-muted">
            We&apos;re looking for chapter leads in {listNames(formingChapters)}, and city leads across India. Or
            bring QuantumX to your own city.
          </p>
          <Button href={href}>Start a chapter</Button>
        </div>
      </div>
    </section>
  );
}
