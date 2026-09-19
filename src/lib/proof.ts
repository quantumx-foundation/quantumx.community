import { events } from "@/content/events";
import { news } from "@/content/news";

/**
 * Headline numbers. The ones that can be counted from the content files are,
 * so they stay honest; the rounded ones are kept up to date by hand.
 */
const cities = new Set(events.filter((e) => e.country !== "online").map((e) => e.city));
const countries = new Set<string>([
  ...events.flatMap((e) => (e.country === "online" ? [] : [e.country])),
  ...news.flatMap((n) => (n.country ? [n.country] : [])),
]);

export const proof = [
  { value: "2000+", label: "Community members" },
  { value: "30+", label: "Events run or joined" },
  { value: String(cities.size), label: "Cities" },
  { value: String(countries.size), label: "Countries on the ground" },
  { value: "200+", label: "Hackers at QX Hack" },
];

/** Hosts and venues from the events list, shown Select-sponsor style. */
export const hosts = [
  { name: "IBM Qiskit Fall Fest", note: "Official host 2026" },
  { name: "Startup Park Bengaluru" },
  { name: "IIT Delhi" },
  { name: "TinkerHub Foundation" },
  { name: "Manipal Institute of Technology" },
  { name: "IIIT Hyderabad" },
  { name: "HKBK Group of Institutions" },
  { name: "ISTE" },
  { name: "University of Bristol" },
  { name: "Imperial College London" },
];
