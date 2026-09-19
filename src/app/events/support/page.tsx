import type { Metadata } from "next";
import Link from "next/link";
import { ApplyForm } from "@/components/apply-form";
import { PageHero, Tag, container } from "@/components/ui";
import { LEAD_DAYS, eventForm } from "@/lib/forms";
import { EVENTS_EMAIL, FNB_URL, SWAG_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get your event supported",
  description: `Running your own quantum computing event? Apply for QuantumX swag for your attendees and we'll cover food and drinks for the room. Ask at least ${LEAD_DAYS} days before the date.`,
  alternates: { canonical: "/events/support" },
};

const linkClass = "text-fg underline decoration-dotted underline-offset-4 hover:text-pink";

const offer = [
  {
    title: "What we cover",
    items: [
      <>
        QuantumX{" "}
        <a href={SWAG_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
          swag
        </a>{" "}
        — stickers, badges and tees — shipped to you in time to hand out on the day.
      </>,
      <>
        <a href={FNB_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Food and drinks
        </a>{" "}
        for the room, against a headcount we agree with you beforehand.
      </>,
      "A speaker from the QuantumX network if you still need one, online or in person.",
      "Your event on the QuantumX Luma calendar and in front of every member nearby.",
    ],
  },
  {
    title: "Who this is for",
    items: [
      "Anyone running a quantum computing event: a campus club, a lab, a student body, a company or you on your own.",
      "You do not need to be a QuantumX chapter. This is the form for events that stand on their own.",
      <>
        Want to run events regularly rather than once?{" "}
        <Link href="/chapters/apply" className={linkClass}>
          Start a chapter
        </Link>{" "}
        instead.
      </>,
    ],
  },
  {
    title: "What we ask",
    items: [
      `Ask at least ${LEAD_DAYS} days before the event, so swag reaches you and the budget clears in time.`,
      "Keep it free, or close to it, and open to students.",
      "List QuantumX as a supporter on the event page and the slides.",
      "Send photos and a headcount afterwards, and follow the code of conduct.",
    ],
  },
];

const next = [
  { when: "Within a week", what: `We read your request and reply. Anything under ${LEAD_DAYS} days out we answer faster, but we may only be able to do part of it.` },
  { when: "We agree the numbers", what: "Headcount, swag quantities and sizes, and how the food gets paid for." },
  { when: "Before the day", what: "Swag ships to your address, and your event goes on our calendar and channels." },
  { when: "Afterwards", what: "You send photos and a headcount, and we settle anything still outstanding." },
];

export default function EventSupportPage() {
  return (
    <>
      <PageHero eyebrow="Event support" title="Running your own quantum event? We'll back it.">
        If you are putting on a quantum computing meetup, workshop or hackathon, apply for QuantumX swag for the
        room and we&apos;ll cover food and drinks. No chapter needed, no cost to you. Ask at least {LEAD_DAYS} days
        before the date.
      </PageHero>

      <section aria-label="What event support covers" className={`${container} grid gap-12 pb-20 md:grid-cols-3`}>
        {offer.map((block) => (
          <div key={block.title}>
            <h2 className="text-lg">{block.title}</h2>
            <ul className="mt-5 space-y-3 text-muted">
              {block.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="text-pink">
                    ·
                  </span>
                  {/* One span, so an item made of several nodes stays one flex item. */}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="form-title" className={`${container} py-12`}>
        <Tag>The request</Tag>
        <h2 id="form-title" className="mt-6 max-w-3xl text-4xl tracking-tight sm:text-5xl">
          Tell us about the event
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          The more concrete this is, the faster we can say yes. A draft registration page and a rough headcount are
          enough to start.
        </p>
        <div className="mt-12">
          <ApplyForm form={eventForm} />
        </div>
      </section>

      <section aria-labelledby="next-title" className={`${container} py-20`}>
        <h2 id="next-title" className="text-4xl tracking-tight sm:text-5xl">
          What happens next
        </h2>
        <ol className="mt-12">
          {next.map((step, i) => (
            <li key={step.when} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-6 gap-y-1 border-b border-line py-6 md:grid-cols-[4rem_12rem_minmax(0,1fr)]">
              <span className="font-pixel text-2xl text-pink">0{i + 1}</span>
              <span className="text-lg">{step.when}</span>
              <p className="col-start-2 text-muted md:col-start-auto">{step.what}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-muted">
          Questions first, or an event sooner than {LEAD_DAYS} days away? Email{" "}
          <a href={`mailto:${EVENTS_EMAIL}`} className={linkClass}>
            {EVENTS_EMAIL}
          </a>{" "}
          and we&apos;ll tell you what we can still do.
        </p>
      </section>
    </>
  );
}
