"use client";

import { useState } from "react";
import { Tag } from "./ui";
import { areas, resourceTypes, resources, type ResourceType } from "@/content/resources";

/** Only the types that have something in them, so no filter ever comes up empty. */
const types = resourceTypes.filter((t) => resources.some((r) => r.type === t));

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z]+/g, "-");
}

export function ResourceLibrary() {
  const [type, setType] = useState<ResourceType | "All">("All");
  const shown = type === "All" ? resources : resources.filter((r) => r.type === type);

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-start lg:justify-between">
        <nav aria-label="Areas" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {areas.map((area) => (
            <a key={area} href={`#${slug(area)}`} className="hover:text-pink">
              {area}
            </a>
          ))}
        </nav>
        <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
          {(["All", ...types] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={`cursor-pointer border px-3 py-1.5 font-pixel text-xs uppercase tracking-widest transition-colors ${
                type === t ? "border-pink bg-pink text-ink" : "border-line text-muted hover:border-pink hover:text-fg"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {areas.map((area) => {
        const items = shown.filter((r) => r.area === area);
        if (!items.length) return null;
        return (
          <section key={area} id={slug(area)} aria-labelledby={`${slug(area)}-title`} className="scroll-mt-8 pt-16">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id={`${slug(area)}-title`} className="text-3xl tracking-tight sm:text-4xl">
                {area}
              </h2>
              <span className="font-mono text-sm text-muted">{items.length}</span>
            </div>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-full flex-col border border-line bg-panel p-5 pt-12 transition-colors hover:border-pink sm:p-6 sm:pt-14"
                  >
                    <span className="absolute left-0 top-0">
                      <Tag tone={r.type === "Workshop recording" ? "pink" : "outline"}>{r.type}</Tag>
                    </span>
                    <span className="text-lg leading-snug group-hover:text-pink">
                      {r.title} <span aria-hidden>↗</span>
                    </span>
                    <span className="mt-1 text-sm text-muted">{r.by}</span>
                    <span className="mt-4 flex-1 text-sm leading-relaxed text-muted">{r.note}</span>
                    <span className="mt-5 font-mono text-xs uppercase tracking-wider text-dim">{r.level}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
