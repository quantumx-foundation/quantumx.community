import { events } from "@/content/events";
import { news } from "@/content/news";
import { speakers } from "@/content/speakers";

/** Headline numbers, all derived from the content files so they stay honest. */
const cities = new Set(events.filter((e) => e.country !== "online").map((e) => e.city));
const countries = new Set<string>([
  ...events.flatMap((e) => (e.country === "online" ? [] : [e.country])),
  ...news.flatMap((n) => (n.country ? [n.country] : [])),
]);

export const proof = [
  { value: String(events.length), label: "Events run or joined" },
  { value: String(cities.size), label: "Cities" },
  { value: String(countries.size), label: "Countries on the ground" },
  { value: String(speakers.length), label: "Speakers" },
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
