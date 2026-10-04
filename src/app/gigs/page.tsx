import type { Metadata } from "next";
import { ApplyForm } from "@/components/apply-form";
import { PageHero, Tag, container } from "@/components/ui";
import { gigForm } from "@/lib/forms";

export const metadata: Metadata = {
  title: "Gig board",
  description:
    "Hiring in quantum? Post jobs, internships and research positions to the QuantumX Community for free.",
  alternates: { canonical: "/gigs" },
};

export default function GigsPage() {
  return (
    <>
      <PageHero eyebrow="Gig board" title="Work in quantum">
        Hiring for a job, internship or research position in quantum? Post your role below for free and reach
        students, researchers and engineers across every QuantumX chapter.
      </PageHero>

      <section id="post" aria-labelledby="post-title" className={`${container} scroll-mt-8 pb-20 pt-8`}>
        <Tag>For companies and labs</Tag>
        <h2 id="post-title" className="mt-6 max-w-3xl text-4xl tracking-tight sm:text-5xl">
          Post a role
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Free, and seen by students, researchers and engineers across every QuantumX chapter. Full-time, internships,
          PhDs and research roles are all welcome. We check each listing before it goes up.
        </p>
        <div className="mt-12">
          <ApplyForm form={gigForm} />
        </div>
      </section>
    </>
  );
}
