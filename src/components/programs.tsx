"use client";

import { useState } from "react";
import { programs } from "@/lib/site";

const tabs = Object.keys(programs) as (keyof typeof programs)[];

export function Programs() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Learn");

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-4xl tracking-tight sm:text-5xl">
        <h2>Programs</h2>
        <span aria-hidden className="font-pixel text-3xl text-pink">
          →
        </span>
        <div role="tablist" aria-label="Program tracks" className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={tab === active}
              aria-controls="programs-panel"
              onClick={() => setActive(tab)}
              className={`cursor-pointer tracking-tight transition-colors ${
                tab === active
                  ? "text-fg underline decoration-pink decoration-dotted decoration-2 underline-offset-8"
                  : "text-muted hover:text-fg"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div id="programs-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-14">
        <div className="hidden grid-cols-[8rem_14rem_1fr_12rem] gap-6 border-b border-line pb-4 text-sm uppercase tracking-wider text-muted md:grid">
          <span>Code</span>
          <span>Format</span>
          <span>What happens</span>
          <span>For</span>
        </div>
        {programs[active].map((program) => (
          <div
            key={program.id}
            className="grid grid-cols-[5.5rem_1fr] gap-x-6 gap-y-1 border-b border-line py-6 md:grid-cols-[8rem_14rem_1fr_12rem]"
          >
            <span className="font-mono text-sm text-muted md:pt-1">{program.id}</span>
            <span className="text-lg">{program.title}</span>
            <p className="col-start-2 text-muted md:col-start-auto md:text-fg">{program.description}</p>
            <span className="col-start-2 text-sm text-muted md:col-start-auto md:pt-1">{program.audience}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
