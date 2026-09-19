import Image from "next/image";
import { Place } from "./country";
import type { EventItem } from "@/content/events";

/** One agenda-style row: date, poster, title and venue, kind, link. */
export function EventRow({ event, upcoming }: { event: EventItem; upcoming: boolean }) {
  const body = (
    <>
      <span className={`font-mono text-sm md:pt-1 ${upcoming ? "text-pink" : "text-muted"}`}>
        {event.displayDate}
      </span>
      <div className="row-span-3 md:row-span-1">
        <Image
          src={event.image}
          alt=""
          width={240}
          height={135}
          className="aspect-video w-32 object-cover grayscale transition duration-500 group-hover:grayscale-0 sm:w-48"
        />
      </div>
      <div className="col-start-1 row-start-2 md:col-start-auto md:row-start-auto">
        <h3 className="text-lg leading-snug group-hover:text-pink">{event.title}</h3>
        <p className="mt-1 text-sm text-muted">{event.venue}</p>
      </div>
      <span className="col-start-1 row-start-3 text-sm text-muted md:col-start-auto md:row-start-auto md:pt-1">
        <Place country={event.country} city={event.city} />
        <span className="md:hidden"> · {event.kind}</span>
      </span>
      <span className="hidden font-mono text-xs uppercase tracking-wider text-muted md:block md:pt-1.5">
        {event.kind}
      </span>
    </>
  );
  const className =
    "group grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 border-b border-line py-6 md:grid-cols-[8.5rem_12rem_1fr_9rem_8rem]";
  return event.url ? (
    <a href={event.url} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function EventTableHead() {
  return (
    <div className="hidden grid-cols-[8.5rem_12rem_1fr_9rem_8rem] gap-6 border-b border-line pb-4 text-sm uppercase tracking-wider text-muted md:grid">
      <span>Date</span>
      <span />
      <span>Event</span>
      <span>Where</span>
      <span>Format</span>
    </div>
  );
}
