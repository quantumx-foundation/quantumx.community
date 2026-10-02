import type { Metadata } from "next";
import { ApplyForm } from "@/components/apply-form";
import { PageHero, Tag, container } from "@/components/ui";
import { openGigs } from "@/content/gigs";
import { gigForm } from "@/lib/forms";
import { DISCORD_URL } from "@/lib/site";

// Closed roles drop off at render time; refresh daily.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Gig board",
  description:
    "Jobs, internships and research positions across the quantum industry, collected by the QuantumX Community. Hiring? Post a role for free.",
  alternates: { canonical: "/gigs" },
};

function shortDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export default function GigsPage() {
  const gigs = openGigs(new Date().toISOString().slice(0, 10));

  return (
    <>
      <PageHero eyebrow="Gig board" title="Work in quantum">
        Jobs, internships and research positions across the quantum industry, not only at QuantumX. Hiring? Post
        your role below for free.
      </PageHero>

      <section aria-label="Open roles" className={`${container} py-8`}>
        {gigs.length ? (
          <>
            <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_8rem_5rem] gap-6 border-b border-line pb-4 font-mono text-xs uppercase tracking-wider text-muted md:grid">
              <span>Role</span>
              <span>Company</span>
              <span>Location</span>
              <span>Type</span>
              <span>Closes</span>
            </div>
            <ul>
              {gigs.map((gig) => (
                <li key={gig.url} className="border-b border-line">
                  <a
                    href={gig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid gap-x-6 gap-y-1 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_8rem_5rem] md:items-baseline"
                  >
                    <span className="text-lg leading-snug group-hover:text-pink">
                      {gig.role} <span aria-hidden>↗</span>
                    </span>
                    <span>{gig.company}</span>
                    <span className="text-muted">
                      {gig.location} · {gig.setup}
                    </span>
                    <span className="font-mono text-sm text-muted">{gig.type}</span>
                    <span className="font-mono text-sm text-muted">{gig.closes ? shortDate(gig.closes) : "Open"}</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="scanlines border border-line p-6 sm:p-10">
            <Tag tone="outline">Opening soon</Tag>
            <p className="mt-6 max-w-xl text-2xl leading-snug">
              The first roles are on their way. Hiring in quantum? Yours could be at the top of the board.
            </p>
            <p className="mt-4 max-w-xl text-muted">
              Until then, the Discord is where people share openings as they find them.{" "}
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="text-pink underline decoration-dotted underline-offset-4 hover:text-fg">
                Join it
              </a>{" "}
              or{" "}
              <a href="#post" className="text-pink underline decoration-dotted underline-offset-4 hover:text-fg">
                post a role
              </a>
              .
            </p>
          </div>
        )}
      </section>

      <section id="post" aria-labelledby="post-title" className={`${container} scroll-mt-8 py-20`}>
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
