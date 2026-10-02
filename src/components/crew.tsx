import Link from "next/link";
import { SpeakerGrid } from "./speaker-grid";
import { Tag } from "./ui";
import type { CrewMember } from "@/content/crew";

/** The empty portrait slot that closes the grid and invites the next volunteer. */
function JoinCrewCard({ first }: { first?: boolean }) {
  return (
    <li className={first ? "col-span-2" : ""}>
      <Link
        href="/crew#join"
        className={`group scanlines relative flex flex-col border border-line p-5 pt-12 transition-colors hover:border-pink ${
          first ? "min-h-64" : "aspect-[4/5]"
        }`}
      >
        <span className="absolute left-0 top-0">
          <Tag tone="outline">Open</Tag>
        </span>
        <span aria-hidden className="flex flex-1 items-center justify-center font-pixel text-5xl text-dim transition-colors group-hover:text-pink">
          ?
        </span>
        <span className="text-lg leading-tight">{first ? "Be the first face here" : "This could be you"}</span>
        <span className="mt-2 font-pixel text-xs uppercase tracking-[0.2em] text-pink">Volunteer &rarr;</span>
      </Link>
    </li>
  );
}

/** Crew portraits, always ending in a slot that links to the volunteer form. */
export function CrewGrid({ items }: { items: CrewMember[] }) {
  return (
    <SpeakerGrid folder="crew" items={items.map((m) => ({ name: m.name, title: `${m.role} · ${m.city}`, slug: m.slug }))}>
      <JoinCrewCard first={items.length === 0} />
    </SpeakerGrid>
  );
}
