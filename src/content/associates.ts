/**
 * Trusted associates, shown as a logo wall on the homepage.
 * Copied from the QX Ventures site, plus Quad AI from the QuantumX School site.
 * Most logos are white-on-transparent, so the homepage inverts them to sit on
 * the light theme.
 */

/**
 * `tall` gives square crests a taller box so they sit level with the wordmarks.
 * `dark` marks a logo that is already dark, so it is not inverted.
 */
export const associates: readonly { name: string; logo: string; tall?: boolean; dark?: boolean }[] = [
  { name: "Freshworks", logo: "/images/associates/freshworks.webp" },
  { name: "Qiskit", logo: "/images/associates/qiskit.webp" },
  { name: "IIIT Hyderabad", logo: "/images/associates/iiit-hyderabad.webp", tall: true },
  { name: "Manipal Academy of Higher Education", logo: "/images/associates/manipal.webp" },
  { name: "TinkerHub Foundation", logo: "/images/associates/tinkerhub.webp" },
  { name: "Girls in Quantum", logo: "/images/associates/girls-in-quantum.webp" },
  { name: "Women in Product India", logo: "/images/associates/women-in-product.webp", tall: true },
  { name: "The Startup Park", logo: "/images/associates/startup-park.webp" },
  { name: "Quad AI", logo: "/images/associates/quad-ai.png", dark: true },
  { name: "WOI India", logo: "/images/associates/woi.webp" },
  { name: "HKBK College of Engineering", logo: "/images/associates/hkbk.webp", tall: true },
  { name: "Toc H Institute of Science and Technology", logo: "/images/associates/tist.webp", tall: true },
  { name: "DeepTech Hackers Day", logo: "/images/associates/deeptech.webp" },
  { name: "Ufuq", logo: "/images/associates/ufuq.webp" },
  { name: "Appetite Studio", logo: "/images/associates/appetite.webp" },
  { name: "Skill Univ", logo: "/images/associates/skill-univ.webp" },
  { name: "WMO Arts and Science College, Muttil", logo: "/images/associates/wmo.webp", tall: true },
];
