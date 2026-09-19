import type { Metadata } from "next";
import { PageHero, container } from "@/components/ui";
import { EVENTS_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Code of conduct",
  description: "How we treat each other at QuantumX Community events, chapters and online spaces.",
  alternates: { canonical: "/code-of-conduct" },
};

const sections = [
  {
    title: "Where this applies",
    items: [
      "Every QuantumX Community space: chapter meetups, workshops, hackathons, the Discord server and our social channels.",
      "Everyone in those spaces: members, speakers, mentors, organisers, volunteers and partners.",
    ],
  },
  {
    title: "What we expect",
    items: [
      "Be respectful and professional. Assume good intent and ask before you correct.",
      "Welcome beginners. Every question is a fair question.",
      "Credit other people's work and ideas. Don't pass off copied work as your own.",
      "Follow instructions from organisers and mentors at events.",
    ],
  },
  {
    title: "What we don't accept",
    items: [
      "Harassment, discrimination or intimidation of any kind, in person or online.",
      "Unwelcome sexual attention, stalking, or recording people without consent.",
      "Sustained disruption of talks, sessions or discussions.",
      "Spam, unsolicited promotion, or sharing other people's personal information.",
    ],
  },
  {
    title: "What happens if someone breaks it",
    items: [
      "Organisers may warn, remove someone from an event or channel, or ban them from future events.",
      "At hackathons, violations can lead to immediate disqualification.",
    ],
  },
];

export default function CodeOfConductPage() {
  return (
    <>
      <PageHero eyebrow="Code of conduct" title="How we treat each other">
        QuantumX is for anyone curious about quantum. Keeping it that way is on all of us.
      </PageHero>
      <section className={`${container} max-w-3xl pb-8`}>
        {sections.map((section, i) => (
          <div key={section.title} className="grid gap-4 border-b border-line py-10 md:grid-cols-[4rem_1fr]">
            <p className="font-mono text-sm text-pink">0{i + 1}</p>
            <div>
              <h2 className="text-2xl tracking-tight">{section.title}</h2>
              <ul className="mt-5 space-y-3 text-muted">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="text-pink">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <div className="py-10 md:pl-20">
          <h2 className="text-2xl tracking-tight">Reporting</h2>
          <p className="mt-4 text-muted">
            If something happens, tell an organiser at the event or email{" "}
            <a href={`mailto:${EVENTS_EMAIL}`} className="text-fg underline decoration-dotted underline-offset-4 hover:text-pink">
              {EVENTS_EMAIL}
            </a>
            . Reports are handled in confidence.
          </p>
        </div>
      </section>
    </>
  );
}
