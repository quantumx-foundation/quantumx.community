import Image from "next/image";
import { Place } from "./country";
import type { EventItem } from "@/content/events";

/** One agenda-style row: date, poster, title and venue, kind, link. */
export function EventRow({ event, upcoming }: { event: EventItem; upcoming: boolean }) {
  const body = (
    <>
      <span className={`font-mono text-sm lg:pt-1 ${upcoming ? "text-pink" : "text-muted"}`}>
        {event.displayDate}
      </span>
      <div className="row-span-3 lg:row-span-1">
        <Image
          src={event.image}
          alt=""
          width={240}
          height={135}
          className="aspect-video w-32 object-cover grayscale transition duration-500 group-hover:grayscale-0 sm:w-48"
        />
      </div>
      <div className="col-start-1 row-start-2 lg:col-start-auto lg:row-start-auto">
        <h3 className="text-lg leading-snug group-hover:text-pink">{event.title}</h3>
        <p className="mt-1 text-sm text-muted">{event.venue}</p>
      </div>
      <span className="col-start-1 row-start-3 text-sm text-muted lg:col-start-auto lg:row-start-auto lg:pt-1">
        <Place country={event.country} city={event.city} />
        <span className="lg:hidden"> · {event.kind}</span>
      </span>
      <span className="hidden font-mono text-xs uppercase tracking-wider text-muted lg:block lg:pt-1.5">
        {event.kind}
      </span>
    </>
  );
  const className =
    "group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 border-b border-line py-6 sm:gap-x-6 lg:grid-cols-[7.5rem_10rem_minmax(0,1fr)_8rem_7rem]";
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
    <div className="hidden grid-cols-[7.5rem_10rem_minmax(0,1fr)_8rem_7rem] gap-6 border-b border-line pb-4 text-sm uppercase tracking-wider text-muted lg:grid">
      <span>Date</span>
      <span />
      <span>Event</span>
      <span>Where</span>
      <span>Format</span>
    </div>
  );
}
