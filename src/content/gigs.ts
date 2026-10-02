export const gigTypes = ["Full-time", "Internship", "PhD or research", "Part-time", "Contract"] as const;

export type Gig = {
  role: string;
  company: string;
  /** "Bengaluru, India", or "Anywhere" for fully remote roles. */
  location: string;
  setup: "On-site" | "Hybrid" | "Remote";
  type: (typeof gigTypes)[number];
  /** Where to apply: the company's own listing. */
  url: string;
  /** YYYY-MM-DD. */
  posted: string;
  /** YYYY-MM-DD. The listing drops off the board after this day. */
  closes?: string;
};

/**
 * Openings across the quantum industry, not only at QuantumX. Most come in
 * through the "Post a role" form at /gigs; check the listing is real before
 * adding it here.
 *
 * Example:
 *   {
 *     role: "Quantum Software Engineer",
 *     company: "Example Quantum",
 *     location: "Bengaluru, India",
 *     setup: "Hybrid",
 *     type: "Full-time",
 *     url: "https://example.com/careers/qse",
 *     posted: "2026-10-01",
 *     closes: "2026-11-15",
 *   },
 */
export const gigs: Gig[] = [];

/** Open listings, newest first. "today" is YYYY-MM-DD. */
export function openGigs(today: string) {
  return gigs.filter((g) => !g.closes || g.closes >= today).sort((a, b) => b.posted.localeCompare(a.posted));
}
