import type { Metadata } from "next";
import Link from "next/link";
import { ApplyForm } from "@/components/apply-form";
import { PageHero, Tag, container } from "@/components/ui";
import { EVENTS_EMAIL, formingChapters, listNames } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a chapter",
  description: `Apply to lead a QuantumX Community chapter in your city. Chapters are forming in ${listNames(formingChapters)}, and anywhere else you want to start one.`,
  alternates: { canonical: "/chapters/apply" },
};

const expectations = [
  {
    title: "What a chapter lead does",
    items: [
      "Runs something every month or two: a meetup, study circle, workshop or paper club.",
      "Keeps the local group talking between events, usually in your chapter's Discord channel.",
      "Brings in speakers and venues locally, with introductions from us where we have them.",
    ],
  },
  {
    title: "What you get",
    items: [
      "Speakers from the QuantumX network, online or in person.",
      "Event formats, run sheets and material that other chapters already use.",
      "Your events on the QuantumX Luma calendar, and your chapter listed on this site.",
    ],
  },
  {
    title: "What we ask",
    items: [
      "Run it free and open to anyone, students included.",
      "Follow the code of conduct, and handle reports seriously.",
      "Tell us how it went, so other chapters can learn from it.",
    ],
  },
];

const next = [
  { when: "Within a week", what: "We read your application and reply. Expect questions about your city and your plan." },
  { when: "A short call", what: "Twenty minutes with the community team to meet you and talk through the first event." },
  { when: "First event", what: "We help you plan it, find a speaker and promote it to everyone nearby." },
  { when: "You go live", what: "Your chapter gets its flag on the chapters page and its own channel." },
];

export default function ApplyPage() {
  return (
    <>
      <PageHero eyebrow="Start a chapter" title="Apply to lead a chapter in your city">
        Chapters are forming in {listNames(formingChapters)}. If your city isn&apos;t on that list, apply anyway:
        the list is where we have momentum, not a limit.
      </PageHero>

      <section aria-label="What leading a chapter involves" className={`${container} grid gap-12 pb-20 md:grid-cols-3`}>
        {expectations.map((block) => (
          <div key={block.title}>
            <h2 className="text-lg">{block.title}</h2>
            <ul className="mt-5 space-y-3 text-muted">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="text-pink">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="form-title" className={`${container} py-12`}>
        <Tag>The application</Tag>
        <h2 id="form-title" className="mt-6 max-w-3xl text-4xl tracking-tight sm:text-5xl">
          Tell us about you and your city
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          It takes about five minutes. You do not need to be a quantum expert, and you do not need a venue or a
          budget yet.
        </p>
        <div className="mt-12">
          <ApplyForm />
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
          Questions first? Email{" "}
          <a href={`mailto:${EVENTS_EMAIL}`} className="text-fg underline decoration-dotted underline-offset-4 hover:text-pink">
            {EVENTS_EMAIL}
          </a>{" "}
          or read the{" "}
          <Link href="/chapters#start" className="text-fg underline decoration-dotted underline-offset-4 hover:text-pink">
            chapter guide
          </Link>
          .
        </p>
      </section>
    </>
  );
}
