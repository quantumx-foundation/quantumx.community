export type CrewMember = {
  name: string;
  /** What they do for the community, e.g. "Event volunteer". */
  role: string;
  city: string;
  /** Photo lives at /images/crew/<slug>.webp. */
  slug: string;
};

/**
 * Volunteers who help run QuantumX events. Add people here once they have
 * helped at an event, then drop their photo in public/images/crew
 * as <slug>.webp.
 *
 * Example:
 *   { name: "Asha Rao", role: "Event volunteer", city: "Bengaluru", slug: "asha-rao" },
 */
export const crew: CrewMember[] = [];
