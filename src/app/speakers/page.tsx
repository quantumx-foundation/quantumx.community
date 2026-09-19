import type { Metadata } from "next";
import { SpeakerGrid } from "@/components/speaker-grid";
import { Button, PageHero, container } from "@/components/ui";
import { speakers } from "@/content/speakers";
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
        <SpeakerGrid items={speakers} />
      </section>
      <section className={`${container} py-24`}>
        <div className="flex flex-col gap-8 border border-line p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl tracking-tight">Want to speak?</h2>
            <p className="mt-3 text-muted">
              We&apos;re always looking for people who can make quantum make sense: researchers, engineers, founders
              and educators. Online or at any chapter.
            </p>
          </div>
          <Button href={`mailto:${EVENTS_EMAIL}?subject=Speaking%20at%20QuantumX`}>Apply to speak</Button>
        </div>
      </section>
    </>
  );
}
