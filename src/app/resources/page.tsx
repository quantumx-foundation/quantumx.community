import type { Metadata } from "next";
import { ResourceLibrary } from "@/components/resource-library";
import { Button, PageHero, container } from "@/components/ui";
import { resources } from "@/content/resources";
import { EVENTS_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Courses, papers, books and tools for learning quantum computing, picked by the QuantumX Community and grouped by area, from first qubits to error correction.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow={`${resources.length} resources`} title="Where to learn quantum, sorted">
        Courses, papers, books and tools the community actually uses, grouped by area and marked by level. Start
        at Foundations if you&apos;re new.
      </PageHero>

      <section className={`${container} py-8`}>
        <ResourceLibrary />
      </section>

      <section className={`${container} py-24`}>
        <div className="flex flex-col gap-8 border border-line p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl tracking-tight">Know something that belongs here?</h2>
            <p className="mt-3 text-muted">
              A paper that finally made it click, a tool you use every day, a talk worth an hour. Send it over and
              we&apos;ll add it.
            </p>
          </div>
          <Button href={`mailto:${EVENTS_EMAIL}?subject=Resource%20suggestion`}>Suggest a resource</Button>
        </div>
      </section>
    </>
  );
}
