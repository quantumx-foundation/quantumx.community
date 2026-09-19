export type Speaker = {
  name: string;
  title: string;
  /** Photo lives at /images/speakers/<slug>.webp, dithered copy at /images/speakers/dither/<slug>.png. */
  slug: string;
};

/** People who have spoken at QuantumX events, workshops and community sessions. */
export const speakers: Speaker[] = [
  { name: "Shaik Aleem Ur Rehaman", title: "Principal Design Engineer, Microsoft", slug: "shaik-aleem-ur-rehaman" },
  { name: "Toji Thomas", title: "Technical Support Engineer, Thorlabs", slug: "toji-thomas" },
  { name: "Vandna Chaturvedi", title: "C-DAC India", slug: "vandna-chaturvedi" },
  { name: "Ajmal Ibn Mohammed Althaf", title: "Founder, CEO & Scientific Lead, QuantumX Foundation", slug: "ajmal" },
  { name: "Shafi Shoukath", title: "Founder, WOI.eco", slug: "shafi-shoukath" },
  { name: "Amar Dixit", title: "CEO, SwiftSeeds, WOI India", slug: "amar-dixit" },
  { name: "Abdul Samad", title: "Co-Founder & Venture Creation Lead, QuantumX Foundation", slug: "abdul-samad" },
  { name: "Dr. Tabassum Ara", title: "Professor & Head, AI & ML, HKBK College of Engineering", slug: "tabassum-ara" },
  { name: "Dr. Manjunath R Kounte", title: "Dean-Academics, Professor & HOD, Electronics and Communication Engineering", slug: "manjunath-r-kounte" },
  { name: "Muhammed Ameen Sulaiman", title: "Co-Founder & CTO, QuantumX Foundation", slug: "ameen" },
  { name: "Dr. Kameshwari AVS", title: "Assistant Professor, VIT Vellore", slug: "kameshwari-avs" },
  { name: "Akash Deb", title: "Founder & CEO, Elato AI", slug: "akash-deb" },
  { name: "Akshat Agarwal", title: "Founder, Arrayah Australia", slug: "akshat-agarwal" },
  { name: "Shreyansu Panda", title: "Research Engineer, QuantumX Foundation", slug: "shreyansu-panda" },
  { name: "Sampark Bhol", title: "Research Engineer, QuantumX Foundation", slug: "sampark-bhol" },
  { name: "Arundas Janardhanan", title: "CEO, Startup Park Bengaluru", slug: "arundas-janardhanan" },
  { name: "Raul John Aju", title: "CEO, ThinkCraft.learn", slug: "raul-john-aju" },
  { name: "Delvin Danny", title: "Founder, PitchStudio", slug: "delvin-danny" },
];
