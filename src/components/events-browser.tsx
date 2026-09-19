"use client";

import { useState } from "react";
import { EventRow, EventTableHead } from "./event-row";
import { type EventItem } from "@/content/events";

type Filter = "All" | "Upcoming" | "Past";

/** Agenda table with All / Upcoming / Past tabs. `upcoming` is decided on the server. */
export function EventsBrowser({ items }: { items: (EventItem & { upcoming: boolean })[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const groups: Record<Filter, typeof items> = {
    All: items,
    Upcoming: items.filter((e) => e.upcoming),
    Past: items.filter((e) => !e.upcoming),
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-4xl tracking-tight sm:text-5xl">
        <h2>Events</h2>
        <span aria-hidden className="font-pixel text-3xl text-pink">
          →
        </span>
        <div role="tablist" aria-label="Filter events" className="flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-6">
          {(Object.keys(groups) as Filter[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={tab === filter}
              aria-controls="events-panel"
              onClick={() => setFilter(tab)}
              className={`cursor-pointer transition-colors ${
                tab === filter
                  ? "text-fg underline decoration-pink decoration-dotted decoration-2 underline-offset-8"
                  : "text-muted hover:text-fg"
              }`}
            >
              {tab}
              <sup className="ml-1 font-mono text-sm text-muted">{groups[tab].length}</sup>
            </button>
          ))}
        </div>
      </div>
      <div id="events-panel" role="tabpanel" className="mt-14">
        <EventTableHead />
        {groups[filter].length === 0 ? (
          <p className="py-10 text-muted">Nothing here yet. Follow us on Luma to hear about the next one.</p>
        ) : (
          groups[filter].map((event) => <EventRow key={event.title} event={event} upcoming={event.upcoming} />)
        )}
      </div>
    </div>
  );
}
