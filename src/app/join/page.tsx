import type { Metadata } from "next";
import { DiscordGate } from "@/components/discord-gate";
import { PageHero, container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Join the Discord",
  description:
    "Get the invite to the QuantumX Community Discord, where every chapter, event and study circle starts.",
  alternates: { canonical: "/join" },
};

const pillars = [
  {
    title: "Learn it properly.",
    body: "Study circles and workshops that take you from linear algebra to running your own circuits, with no gatekeeping.",
  },
  {
    title: "Build with others.",
    body: "Hackathons, open projects and demo nights, run by each chapter and shared across all of them.",
  },
  {
    title: "Meet the field.",
    body: "Mentors, researchers and speakers from labs, startups and industry, in person and online.",
  },
];

/** Short link: quantumx.community/join. Hands out the Discord invite for an email. */
export default function JoinPage() {
  return (
    <>
      <PageHero eyebrow="Discord" title="Everything starts on Discord">
        Chapters, events, study circles and the people behind them. Leave your email and the invite is yours.
      </PageHero>
      <section aria-label="Get the invite" className={`${container} pb-16`}>
        <DiscordGate source="join" ask />
      </section>
      <section aria-label="What you get" className={`${container} grid gap-12 border-t border-line py-16 md:grid-cols-3`}>
        {pillars.map((item) => (
          <div key={item.title}>
            <h2 className="text-lg">{item.title}</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
