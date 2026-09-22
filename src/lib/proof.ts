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
  { value: "300+", label: "Hackers at QX Hack" },
  { value: "$1,57,355.00", label: "Deployed on community" },
];

/** Hosts and venues from the events list, shown Select-sponsor style. */
export const hosts = [
  { name: "IBM Qiskit Fall Fest", note: "Official host 2026" },
  { name: "University of Oxford" },
  { name: "Imperial College London" },
  { name: "University of Bristol" },
  { name: "IIT Delhi" },
  { name: "IISc Bengaluru" },
  { name: "DIFC Innovation Hub" },
  { name: "ISTE" },
  { name: "Manipal Institute of Technology" },
  { name: "IIIT Hyderabad" },
  { name: "BQIT:26" },
  { name: "Engine Shed Bristol" },
  { name: "TinkerHub Foundation" },
  { name: "Startup Park Bengaluru" },
  { name: "Girls in Quantum" },
  { name: "HKBK Group of Institutions" },
  { name: "Kristu Jayanti University" },
  { name: "VIT Chennai" },
  { name: "Woi.eco" },
  { name: "QETCI" },
  { name: "Freshworks" },
  { name: "Women in Product" },
];
