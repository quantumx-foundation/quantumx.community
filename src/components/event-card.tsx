import Image from "next/image";
import type { ReactNode } from "react";
import { Place } from "./country";
import type { EventItem } from "@/content/events";

function Detail({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} className="size-4 shrink-0 text-muted">
        {icon}
      </svg>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

const pin = (
  <>
    <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8z" />
    <circle cx={8} cy={6.5} r={1.6} />
  </>
);
const calendar = (
  <>
    <rect x={2} y={3} width={12} height={11} />
    <path d="M2 6.5h12M5 1.5v3M11 1.5v3" />
  </>
);
const venueIcon = <path d="M2 14.5h12M3.5 14.5V5L8 2l4.5 3v9.5M6.5 14.5v-4h3v4" />;

/** One event as a poster card: image, title and tags, where and when, then a link out. */
export function EventCard({ event, upcoming }: { event: EventItem; upcoming: boolean }) {
  const body = (
    <>
      <div className="relative aspect-video overflow-hidden border-b border-line bg-panel">
        <Image
          src={event.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug tracking-tight transition-colors group-hover:text-purple">{event.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wider">
          <span className="bg-pale px-2 py-1 text-purple">{event.kind}</span>
          <span className={`border px-2 py-1 ${upcoming ? "border-purple text-purple" : "border-line text-muted"}`}>
            {upcoming ? "Upcoming" : "Past"}
          </span>
        </div>
        <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
          <Detail icon={pin}>
            <Place country={event.country} city={event.city} />
          </Detail>
          <Detail icon={calendar}>{event.displayDate}</Detail>
          {event.venue !== event.city && event.venue !== "Virtual" && <Detail icon={venueIcon}>{event.venue}</Detail>}
        </ul>
        <div className="mt-auto pt-6 text-center font-pixel text-xs uppercase tracking-[0.2em]">
          {event.url ? (
            <span className="block bg-fg py-3 text-bg transition-colors group-hover:bg-purple">View details ↗</span>
          ) : (
            <span className="block border border-line py-3 text-muted">Details soon</span>
          )}
        </div>
      </div>
    </>
  );
  const className = "group flex flex-col border border-line bg-bg transition-colors hover:border-purple";
  return event.url ? (
    <a href={event.url} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

/** Responsive grid of event cards. */
export function EventGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
