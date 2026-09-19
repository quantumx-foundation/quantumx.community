import Link from "next/link";
import { ArrowField } from "./animations";
import { PixelFlag } from "./pixel-flag";
import { Button, Tag } from "./ui";
import { chapters, formingChapters, listNames, type Chapter } from "@/lib/site";

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

export function ChapterGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
      {chapters.map((chapter, i) => (
        <ChapterCard key={chapter.code} chapter={chapter} featured={i === 0} />
      ))}
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
            We&apos;re looking for founding members and chapter leads in {listNames(formingChapters)}. Or bring
            QuantumX to your own city.
          </p>
          <Button href={href}>Start a chapter</Button>
        </div>
      </div>
    </section>
  );
}
