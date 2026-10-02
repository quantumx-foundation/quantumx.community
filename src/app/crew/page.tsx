import type { Metadata } from "next";
import { ApplyForm } from "@/components/apply-form";
import { CrewGrid } from "@/components/crew";
import { PageHero, Tag, container } from "@/components/ui";
import { crew } from "@/content/crew";
import { volunteerForm } from "@/lib/forms";
import { EVENTS_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "The crew",
  description:
    "The volunteers who run QuantumX Community events. Help at meetups, workshops and hackathons near you, and get your name on the crew.",
  alternates: { canonical: "/crew" },
};

const expectations = [
  {
    title: "What a volunteer does",
    items: [
      "Helps set up the room, check people in and keep the day on schedule.",
      "Looks after speakers and first-timers, so nobody stands alone at the back.",
      "Takes a few photos and helps tell people about the next event.",
    ],
  },
  {
    title: "What you get",
    items: [
      "Your face, name and role on this page and the homepage.",
      "A crew role on the QuantumX Discord.",
      "Time with speakers, researchers and founders behind the scenes.",
      "QuantumX swag, and a first look at every event near you.",
    ],
  },
  {
    title: "What we ask",
    items: [
      "Show up when you say you will, or tell the lead early if you can't.",
      "Follow the code of conduct, and flag anything that doesn't feel right.",
      "No quantum background needed. Curiosity is enough.",
    ],
  },
];

export default function CrewPage() {
  return (
    <>
      <PageHero eyebrow="The crew" title="The people who make the room happen">
        Every QuantumX event is run by volunteers from the community. Help at one near you and your face goes up
        here.
      </PageHero>

      <section aria-label="Crew members" className={`${container} py-8`}>
        <CrewGrid items={crew} />
      </section>

      <section aria-label="What volunteering involves" className={`${container} grid gap-12 py-20 md:grid-cols-3`}>
        {expectations.map((block) => (
          <div key={block.title}>
            <h2 className="text-lg">{block.title}</h2>
            <ul className="mt-5 space-y-3 text-muted">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="text-pink">
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id="join" aria-labelledby="form-title" className={`${container} scroll-mt-8 py-12`}>
        <Tag>Event volunteer</Tag>
        <h2 id="form-title" className="mt-6 max-w-3xl text-4xl tracking-tight sm:text-5xl">
          Join the crew
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Two minutes. Tell us where you are and how often you can help, and we&apos;ll reach out before the next
          event near you. Questions?{" "}
          <a href={`mailto:${EVENTS_EMAIL}`} className="text-fg underline decoration-dotted underline-offset-4 hover:text-pink">
            {EVENTS_EMAIL}
          </a>
        </p>
        <div className="mt-12">
          <ApplyForm form={volunteerForm} />
        </div>
      </section>
    </>
  );
}
