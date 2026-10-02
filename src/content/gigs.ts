import qetci from "./qetci-jobs.json";

export const gigTypes = ["Full-time", "Internship", "PhD or research", "Part-time", "Contract"] as const;
export const orgTypes = ["Startup", "Corporate", "Academia", "Government"] as const;

export type Gig = {
  role: string;
  company: string;
  orgType: (typeof orgTypes)[number] | null;
  /** "Bengaluru, India", or "Anywhere" for fully remote roles. */
  location: string;
  /** Cities, for the location filter. */
  places: string[];
  setup: "On-site" | "Hybrid" | "Remote" | null;
  type: (typeof gigTypes)[number];
  /** Where to apply: the organisation's own listing. */
  url: string | null;
  /** YYYY-MM-DD, when known. */
  posted: string | null;
  /** YYYY-MM-DD. The listing drops off the board after this day. */
  closes: string | null;
  pay?: string | null;
  /** Who listed it: posted to us directly, or from the QETCI Ecosystem Hub. */
  source: "QuantumX" | "QETCI";
};

/**
 * Roles posted to us directly, mostly through the "Post a role" form at /gigs.
 * Check the listing is real before adding it here.
 *
 * Example:
 *   {
 *     role: "Quantum Software Engineer",
 *     company: "Example Quantum",
 *     orgType: "Startup",
 *     location: "Bengaluru, India",
 *     places: ["Bengaluru"],
 *     setup: "Hybrid",
 *     type: "Full-time",
 *     url: "https://example.com/careers/qse",
 *     posted: "2026-10-01",
 *     closes: "2026-11-15",
 *     source: "QuantumX",
 *   },
 */
const ours: Gig[] = [];

/**
 * Indian quantum roles from the QETCI Ecosystem Hub, shown with their
 * permission. Refreshed by hand with `python3 scripts/import-qetci-jobs.py`.
 */
const fromQetci = qetci.jobs as Gig[];

/** Open listings, newest first; undated ones last. "today" is YYYY-MM-DD. */
export function openGigs(today: string) {
  return [...ours, ...fromQetci]
    .filter((g) => !g.closes || g.closes >= today)
    .sort((a, b) => (b.posted ?? "").localeCompare(a.posted ?? ""));
}
