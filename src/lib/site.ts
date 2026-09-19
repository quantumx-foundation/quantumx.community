export const DISCORD_URL = "https://discord.gg/2w3pgqTQY";

/** Google Analytics 4 measurement ID. Public by design: it ships in the HTML. */
export const GA_MEASUREMENT_ID = "G-E3ZQDVV4WE";

/**
 * Short links (/join, /discord) that redirect to Discord.
 *
 * Discord reports uses per invite code, not per query string, so the only way
 * to see how many people arrive through each link is to create a separate
 * invite in Discord (Server settings > Invites) and paste its URL here. Until
 * then every link falls back to the main invite and the tags below are only
 * useful in our own request logs.
 */
export const shortLinks: Record<string, string> = {
  join: DISCORD_URL,
  discord: DISCORD_URL,
};

/** Invite URL for a short link, tagged with its source (and optional ?ref=). */
export function inviteFor(source: string, ref?: string | null) {
  const url = new URL(shortLinks[source] ?? DISCORD_URL);
  url.searchParams.set("utm_source", "quantumx.community");
  url.searchParams.set("utm_medium", source);
  if (ref) url.searchParams.set("utm_campaign", ref.slice(0, 40));
  return url.toString();
}
export const EVENTS_EMAIL = "events@quantumx.community";

/** What a chapter event gets from us. Shown on the chapters FAQ and the apply page. */
export const FNB_URL =
  "https://www.tillamook.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fj8tkpy1gjhi5%2F5OvVmigx6VIUsyoKz1EHUs%2Fb8173b7dcfbd6da341ce11bcebfa86ea%2FSalami-pizza-hero.jpg&w=3840&q=75";

export const SWAG_URL =
  "https://xaqtrumkglthinogblad.supabase.co/storage/v1/object/public/email-images/2026/09/4a7960b3-image.jpg";

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/quantumx-foundation/" },
  { label: "X", href: "https://x.com/_Quantum_X_" },
  { label: "Instagram", href: "https://www.instagram.com/quantumx.school/" },
  { label: "Luma", href: "https://luma.com/user/quantumx" },
];

export const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "/chapters" },
  { label: "Speakers", href: "/speakers" },
  { label: "QX Hack", href: "/hackathon" },
  { label: "News", href: "/news" },
];

export const SITE_URL = "https://quantumx.community";
export const FOUNDATION_URL = "https://quantumx.foundation";

export type FlagCode = "in" | "ae" | "gb" | "us" | "sg" | "my" | "au" | "kz" | "sa";

export type Chapter = {
  code: FlagCode;
  name: string;
  short: string;
  status: "live" | "forming";
  summary: string;
};

const forming = "Looking for founding members and chapter leads.";

export const chapters: Chapter[] = [
  {
    code: "in",
    name: "India",
    short: "India",
    status: "live",
    summary: "Meetups, study circles, workshops and hackathons.",
  },
  {
    code: "ae",
    name: "United Arab Emirates",
    short: "UAE",
    status: "live",
    summary: "Meetups, speaker sessions and workshops.",
  },
  { code: "gb", name: "United Kingdom", short: "UK", status: "forming", summary: forming },
  { code: "us", name: "United States", short: "US", status: "forming", summary: forming },
  { code: "sg", name: "Singapore", short: "Singapore", status: "forming", summary: forming },
  { code: "my", name: "Malaysia", short: "Malaysia", status: "forming", summary: forming },
  { code: "au", name: "Australia", short: "Australia", status: "forming", summary: forming },
  { code: "kz", name: "Kazakhstan", short: "Kazakhstan", status: "forming", summary: forming },
  { code: "sa", name: "Saudi Arabia", short: "Saudi Arabia", status: "forming", summary: forming },
];

export const liveChapters = chapters.filter((c) => c.status === "live");
export const formingChapters = chapters.filter((c) => c.status === "forming");

export type City = {
  name: string;
  /** The chapter this city sits under. */
  country: FlagCode;
  /** "live" once a city has a lead running it, "forming" while we look for one. */
  status: "live" | "forming";
};

/**
 * Cities inside a live chapter. A country goes live first; the cities under it
 * each need their own lead before they run on their own.
 */
export const cities: City[] = [
  { name: "Bengaluru", country: "in", status: "live" },
  { name: "Delhi", country: "in", status: "forming" },
  { name: "Hyderabad", country: "in", status: "forming" },
  { name: "Pune", country: "in", status: "forming" },
  { name: "Kochi", country: "in", status: "forming" },
  { name: "Chennai", country: "in", status: "forming" },
];

export const liveCities = cities.filter((c) => c.status === "live");
export const formingCities = cities.filter((c) => c.status === "forming");

/** "A, B and C" */
export function listNames(items: Array<string | { short: string }>) {
  const names = items.map((item) => (typeof item === "string" ? item : item.short));
  return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/** "A, B and C" for cities, which have one name rather than a long and short one. */
export function listCities(items: City[]) {
  return listNames(items.map((c) => c.name));
}

export type Program = {
  id: string;
  title: string;
  description: string;
  audience: string;
};

export const programs: Record<"Learn" | "Build" | "Connect", Program[]> = {
  Learn: [
    {
      id: "LRN-01",
      title: "Study circles",
      description:
        "Small groups working through linear algebra, qubits and circuits at a steady weekly pace.",
      audience: "Students, beginners",
    },
    {
      id: "LRN-02",
      title: "Workshops",
      description:
        "Hands-on sessions with Qiskit, Cirq and PennyLane, from a first circuit to variational algorithms.",
      audience: "Anyone with a laptop",
    },
    {
      id: "LRN-03",
      title: "Paper club",
      description:
        "One paper at a time, broken down together, from the classics to this month's arXiv.",
      audience: "Researchers, the curious",
    },
  ],
  Build: [
    {
      id: "BLD-01",
      title: "Hackathons",
      description:
        "Weekend builds on quantum algorithms, simulators and hybrid quantum-classical apps.",
      audience: "Teams of 2 to 4",
    },
    {
      id: "BLD-02",
      title: "Open projects",
      description:
        "Community-maintained tools, notebooks and learning material that anyone can contribute to.",
      audience: "Contributors",
    },
    {
      id: "BLD-03",
      title: "Demo nights",
      description:
        "Show what you built and get feedback from people who have shipped in the field.",
      audience: "Builders",
    },
  ],
  Connect: [
    {
      id: "CNT-01",
      title: "Mentor office hours",
      description:
        "Time with researchers and engineers working in quantum, for questions you can't search for.",
      audience: "Mentees",
    },
    {
      id: "CNT-02",
      title: "Speaker sessions",
      description:
        "Talks and fireside chats with people from labs, startups and industry.",
      audience: "Everyone",
    },
    {
      id: "CNT-03",
      title: "Cross-chapter meetups",
      description:
        "Online sessions that bring every chapter, live and forming, into one room.",
      audience: "All chapters",
    },
  ],
};
