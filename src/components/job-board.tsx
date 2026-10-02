"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Tag } from "./ui";
import { gigTypes, orgTypes, type Gig } from "@/content/gigs";

const PAGE = 30;
const REMOTE = "Remote or hybrid";

type Filters = { query: string; type: string; org: string; place: string };
const none: Filters = { query: "", type: "All", org: "All", place: "All" };

function matches(gig: Gig, f: Filters) {
  if (f.type !== "All" && gig.type !== f.type) return false;
  if (f.org !== "All" && gig.orgType !== f.org) return false;
  if (f.place !== "All") {
    if (f.place === REMOTE) {
      if (gig.setup !== "Remote" && gig.setup !== "Hybrid") return false;
    } else if (!gig.places.includes(f.place)) return false;
  }
  if (f.query) {
    const haystack = `${gig.role} ${gig.company} ${gig.location}`.toLowerCase();
    if (!f.query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word))) return false;
  }
  return true;
}

function shortDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

const selectClass =
  "w-full cursor-pointer border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition-colors focus:border-pink";

function Select({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  className?: string;
  label: string;
  value: string;
  options: { value: string; label: string; count: number }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-mono text-xs uppercase tracking-wider text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`select mt-2 ${selectClass}`}>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.count === 0 && o.value !== value}>
            {o.label} ({o.count})
          </option>
        ))}
      </select>
    </label>
  );
}

export function JobBoard({ gigs }: { gigs: Gig[] }) {
  const [filters, setFilters] = useState(none);
  const [shown, setShown] = useState(PAGE);
  const query = useDeferredValue(filters.query);
  const active = { ...filters, query };

  const set = (key: keyof Filters) => (value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setShown(PAGE);
  };

  const results = gigs.filter((g) => matches(g, active));
  /** How many roles an option would show, given the other filters as they stand. */
  const count = (key: keyof Filters, value: string) => gigs.filter((g) => matches(g, { ...active, [key]: value })).length;

  // Cities by how many roles they carry, so the busiest come first.
  const places = useMemo(() => {
    const tally = new Map<string, number>();
    gigs.forEach((g) => g.places.forEach((p) => tally.set(p, (tally.get(p) ?? 0) + 1)));
    return [...tally].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([p]) => p);
  }, [gigs]);

  const filtered = filters.query || filters.type !== "All" || filters.org !== "All" || filters.place !== "All";

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 border border-line bg-panel p-4 sm:gap-5 sm:p-6 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <label className="col-span-2 block lg:col-span-1">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Search</span>
          <input
            type="search"
            value={filters.query}
            onChange={(e) => set("query")(e.target.value)}
            placeholder="Role, organisation or city"
            className="mt-2 w-full border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-pink"
          />
        </label>
        <Select
          label="Role type"
          value={filters.type}
          onChange={set("type")}
          options={[{ value: "All", label: "All roles", count: count("type", "All") }].concat(
            gigTypes.map((t) => ({ value: t, label: t, count: count("type", t) })).filter((o) => o.count || o.value === filters.type),
          )}
        />
        <Select
          label="Organisation"
          value={filters.org}
          onChange={set("org")}
          options={[{ value: "All", label: "All organisations", count: count("org", "All") }].concat(
            orgTypes.map((t) => ({ value: t, label: t, count: count("org", t) })),
          )}
        />
        <Select
          label="Location"
          className="col-span-2 lg:col-span-1"
          value={filters.place}
          onChange={set("place")}
          options={[
            { value: "All", label: "All locations", count: count("place", "All") },
            { value: REMOTE, label: REMOTE, count: count("place", REMOTE) },
            ...places.map((p) => ({ value: p, label: p, count: count("place", p) })),
          ]}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
        <p aria-live="polite" className="font-mono text-sm text-muted">
          {results.length} {results.length === 1 ? "open role" : "open roles"}
        </p>
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setFilters(none);
              setShown(PAGE);
            }}
            className="cursor-pointer font-pixel text-xs uppercase tracking-[0.2em] text-pink hover:text-fg"
          >
            Clear filters ×
          </button>
        )}
      </div>

      {results.length ? (
        <ul className="mt-4 border-t border-line">
          {results.slice(0, shown).map((gig, i) => {
            const Row = gig.url ? "a" : "div";
            return (
              <li key={`${gig.url ?? gig.role}-${i}`} className="border-b border-line">
                <Row
                  {...(gig.url ? { href: gig.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group grid gap-x-6 gap-y-1 py-5 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_minmax(0,1fr)_9rem] md:items-baseline"
                >
                  <span className="leading-snug">
                    <span className="text-lg group-hover:text-pink">{gig.role}</span>
                    {gig.url && <span aria-hidden> ↗</span>}
                    <span className="mt-1 block font-mono text-xs text-muted">
                      {gig.type}
                      {gig.pay && ` · ${gig.pay}`}
                    </span>
                  </span>
                  <span className="mt-2 md:mt-0">
                    {gig.company}
                    {gig.orgType && (
                      <span className="text-sm text-muted md:block">
                        <span className="md:hidden"> · </span>
                        {gig.orgType}
                      </span>
                    )}
                  </span>
                  <span className="text-muted">
                    {gig.location}
                    {gig.setup && gig.setup !== "On-site" && !gig.location.includes(gig.setup) && ` · ${gig.setup}`}
                  </span>
                  <span className="font-mono text-xs text-muted md:text-right">
                    {gig.closes ? `Apply by ${shortDate(gig.closes)}` : gig.posted ? `Posted ${shortDate(gig.posted)}` : ""}
                    {gig.source === "QuantumX" && (
                      <span className="ml-2 inline-block align-middle">
                        <Tag>Posted here</Tag>
                      </span>
                    )}
                  </span>
                </Row>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 border-t border-line py-12 text-center text-muted">No open roles match those filters.</p>
      )}

      {results.length > shown && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="cursor-pointer border border-pink px-7 py-4 font-pixel text-sm uppercase tracking-[0.2em] text-pink transition-colors hover:bg-pink hover:text-ink"
          >
            Show more ({results.length - shown} left)
          </button>
        </div>
      )}
    </div>
  );
}
