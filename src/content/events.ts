import type { FlagCode } from "@/lib/site";

export type EventItem = {
  title: string;
  /** ISO date used for sorting and upcoming/past status. */
  date: string;
  displayDate: string;
  venue: string;
  city: string;
  country: FlagCode | "online";
  kind: string;
  image: string;
  url: string | null;
};

export const LUMA_URL = "https://luma.com/user/quantumx";

export const events: EventItem[] = [
  {
    title: "Qiskit Fall Fest 2026: Quantum Community Connect",
    date: "2026-10-10",
    displayDate: "Oct 10, 2026",
    venue: "Startup Park Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Meetup",
    image: "/images/events/qiskit-fall-fest-2026-quantum-community-connect.webp",
    url: "https://luma.com/1sxdwrff",
  },
  {
    title: "Qiskit Fall Fest 2026: Foundations of Quantum Computing",
    date: "2026-10-17",
    displayDate: "Oct 17, 2026",
    venue: "Virtual",
    city: "Online",
    country: "online",
    kind: "Talk",
    image: "/images/events/qiskit-fall-fest-2026-foundations-of-quantum-computing.webp",
    url: "https://luma.com/8jpgnkcg",
  },
  {
    title: "Qiskit Fall Fest 2026: Quantum Hack Day Kochi",
    date: "2026-11-01",
    displayDate: "Nov 1, 2026",
    venue: "TinkerSpace, Kochi",
    city: "Kochi",
    country: "in",
    kind: "Hackathon",
    image: "/images/events/qiskit-fall-fest-2026-quantum-hack-day-kochi.webp",
    url: "https://luma.com/ndjvmw7w",
  },
  {
    title: "Qiskit Fall Fest 2026: Quantum and Qiskit 101",
    date: "2026-11-06",
    displayDate: "Nov 6, 2026",
    venue: "Startup Park Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Workshop",
    image: "/images/events/qiskit-fall-fest-2026-quantum-and-qiskit-101.webp",
    url: "https://luma.com/hczdve5y",
  },
  {
    title: "Qiskit Fall Fest 2026: Hands-On Quantum Programming with Qiskit",
    date: "2026-11-16",
    displayDate: "Nov 16, 2026",
    venue: "HKBK College of Engineering, Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Workshop",
    image: "/images/events/qiskit-fall-fest-2026-hands-on-quantum-programming-with-qisk.webp",
    url: "https://luma.com/79i0vamg",
  },
  {
    title: "Qiskit Fall Fest: QuantumX Summit",
    date: "2026-11-28",
    displayDate: "Nov 28, 2026",
    venue: "Startup Park Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Summit",
    image: "/images/events/qiskit-fall-fest-quantumx-summit.webp",
    url: "https://luma.com/rzpptnuq",
  },
  {
    title: "QX School Bootcamp",
    date: "2026-08-29",
    displayDate: "Aug 29-30, 2026",
    venue: "Bengaluru, Karnataka",
    city: "Bengaluru",
    country: "in",
    kind: "Bootcamp",
    image: "/images/events/qx-school-bootcamp.webp",
    url: null,
  },
  {
    title: "2 Day FDP on Quantum Computing",
    date: "2026-08-12",
    displayDate: "Aug 12-13, 2026",
    venue: "Tirunelveli, Tamil Nadu",
    city: "Tirunelveli",
    country: "in",
    kind: "Faculty programme",
    image: "/images/events/2-day-fdp-on-quantum-computing.webp",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSfSnjVMEALOeUvwTo0-xDMEt91ABivE-pyG-Kk3JWC1vZe0Ug/viewform",
  },
  {
    title: "ISTE-BNY One Week Knowledge Enhancement Programme: 2026",
    date: "2026-07-06",
    displayDate: "Jul 6-11, 2026",
    venue: "Virtual",
    city: "Online",
    country: "online",
    kind: "Programme",
    image: "/images/events/iste-bny-one-week-knowledge-enhancement-programme-2026.webp",
    url: null,
  },
  {
    title: "Quantum for Social Good Hackathon",
    date: "2026-05-23",
    displayDate: "May 23, 2026",
    venue: "Startup Park, Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Hackathon",
    image: "/images/events/quantum-for-social-good-hackathon.webp",
    url: "https://luma.com/x9mbuajz",
  },
  {
    title: "BQIT:26",
    date: "2026-04-27",
    displayDate: "Apr 27, 2026",
    venue: "Bristol, UK",
    city: "Bristol",
    country: "gb",
    kind: "Conference",
    image: "/images/events/bqit-26.webp",
    url: "https://www.bristol.ac.uk/qet-labs/events/bqit-workshop",
  },
  {
    title: "Research Computing Showcase Day 2026",
    date: "2026-04-21",
    displayDate: "Apr 21, 2026",
    venue: "London",
    city: "London",
    country: "gb",
    kind: "Conference",
    image: "/images/events/research-computing-showcase-day-2026.webp",
    url: "https://www.imperial.ac.uk/events/204857/research-computing-showcase-day-2026/",
  },
  {
    title: "World Quantum Day Virtual Meetup by QuantumX",
    date: "2026-04-14",
    displayDate: "Apr 14, 2026",
    venue: "Virtual",
    city: "Online",
    country: "online",
    kind: "Meetup",
    image: "/images/events/world-quantum-day-virtual-meetup-by-quantumx.webp",
    url: "https://luma.com/zcprhku5?tk=DyRRML",
  },
  {
    title: "Quantum Computing Workshop",
    date: "2026-04-11",
    displayDate: "Apr 11, 2026",
    venue: "Startup Park Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Workshop",
    image: "/images/events/quantum-computing-workshop.webp",
    url: "https://luma.com/e861574e",
  },
  {
    title: "Quantum Computing Workshop: SkillUniv x QuantumX",
    date: "2026-02-28",
    displayDate: "Feb 28, 2026",
    venue: "Startup Park, Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Workshop",
    image: "/images/events/quantum-computing-workshop-skill-univ-x-quantumx.webp",
    url: "https://luma.com/3tqticy3",
  },
  {
    title: "QuantumX Community Meetup: Bengaluru",
    date: "2026-03-01",
    displayDate: "Mar 1, 2026",
    venue: "Bengaluru, Karnataka",
    city: "Bengaluru",
    country: "in",
    kind: "Meetup",
    image: "/images/events/quantumx-community-meetup-bengaluru.webp",
    url: "https://luma.com/kv91l2z7?tk=VuAtus",
  },
  {
    title: "Decoherence in Quantum Computing & Communication",
    date: "2026-02-25",
    displayDate: "Feb 25, 2026",
    venue: "MIT Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Talk",
    image: "/images/events/decoherence-in-quantum-computing-communication.webp",
    url: "https://urvishnu.github.io/quantum-ai/",
  },
  {
    title: "Quantum Technologies 101",
    date: "2026-02-22",
    displayDate: "Feb 22, 2026",
    venue: "TinkerHub Foundation, Kochi",
    city: "Kochi",
    country: "in",
    kind: "Talk",
    image: "/images/events/quantum-technologies-101.webp",
    url: "https://tinkerhub.org/events/BYD1JKA6YR/quantum-technologies-101",
  },
  {
    title: "Bits to Qubits: Transforming Technology with Quantum Computing",
    date: "2026-01-05",
    displayDate: "Jan 5, 2026",
    venue: "HKBK Group of Institutions, Bangalore",
    city: "Bengaluru",
    country: "in",
    kind: "Talk",
    image: "/images/events/bits-to-qubits-transforming-technology-with-quantum-computin.webp",
    url: null,
  },
  {
    title: "Technical Workshop on Quantum Sensing for Industry Professionals",
    date: "2026-01-22",
    displayDate: "Jan 22, 2026",
    venue: "IIITH, Hyderabad",
    city: "Hyderabad",
    country: "in",
    kind: "Workshop",
    image: "/images/events/technical-workshop-on-quantum-sensing-for-industry-professio.webp",
    url: "https://forms.gle/EVVgbfURWYBDNGZ69",
  },
  {
    title: "From Classroom to Quantum Computing",
    date: "2026-01-26",
    displayDate: "Jan 26, 2026",
    venue: "Kozhikode, Kerala",
    city: "Kozhikode",
    country: "in",
    kind: "Talk",
    image: "/images/events/from-classroom-to-quantum-computing.webp",
    url: "https://ufuqstfsiokerala.eventhex.ai/speakers/ajmal-ibn-mohammed-althaf",
  },
  {
    title: "Journey in Founding a Quantum Computing Startup",
    date: "2025-12-20",
    displayDate: "Dec 20, 2025",
    venue: "WMO Arts & Science College, Wayanad, Kerala",
    city: "Wayanad",
    country: "in",
    kind: "Talk",
    image: "/images/events/journey-in-founding-a-quantum-computing-startup.webp",
    url: null,
  },
  {
    title: "DeepTech Hackers Day: Startup Park Bengaluru",
    date: "2025-11-12",
    displayDate: "Nov 12, 2025",
    venue: "Startup Park, Bengaluru",
    city: "Bengaluru",
    country: "in",
    kind: "Hackathon",
    image: "/images/events/deeptech-hackers-day-startup-park-bengaluru.webp",
    url: "https://luma.com/3tqticy3",
  },
];

export function isUpcoming(date: string, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return new Date(`${date}T00:00:00`) >= today;
}

/** Upcoming soonest first, then past most recent first. */
export function sortedEvents(now = new Date()) {
  return [...events].sort((a, b) => {
    const aUp = isUpcoming(a.date, now);
    const bUp = isUpcoming(b.date, now);
    if (aUp !== bUp) return aUp ? -1 : 1;
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return aUp ? diff : -diff;
  });
}

export const eventCities = [...new Set(events.map((e) => e.city).filter((c) => c !== "Online"))];
