import type { Metadata } from "next";
import { ApplyForm } from "@/components/apply-form";
import { SpeakerGrid } from "@/components/speaker-grid";
import { PageHero, Tag, container } from "@/components/ui";
import { speakers } from "@/content/speakers";
import { speakerForm } from "@/lib/forms";
import { EVENTS_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Researchers, founders and engineers from Microsoft, C-DAC, Thorlabs, VIT and more who have spoken at QuantumX Community events.",
  alternates: { canonical: "/speakers" },
};

export default function SpeakersPage() {
  return (
    <>
      <PageHero eyebrow="Speakers" title="Voices from our stages">
        Researchers, founders and engineers who have spoken at QuantumX events, workshops and community
        sessions.
      </PageHero>
      <section className={`${container} py-8`}>
        <SpeakerGrid items={speakers} eager={6} />
      </section>
      <section id="apply" aria-labelledby="form-title" className={`${container} scroll-mt-8 py-24`}>
        <Tag>Apply to speak</Tag>
        <h2 id="form-title" className="mt-6 max-w-3xl text-4xl tracking-tight sm:text-5xl">
          Want to speak?
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          We&apos;re always looking for people who can make quantum make sense: researchers, engineers, founders and
          educators. Questions?{" "}
          <a href={`mailto:${EVENTS_EMAIL}`} className="text-fg underline decoration-dotted underline-offset-4 hover:text-purple">
            {EVENTS_EMAIL}
          </a>
        </p>
        <div className="mt-12">
          <ApplyForm form={speakerForm} />
        </div>
      </section>
    </>
  );
}
