import { chapters, formingCities, listCities } from "./site";

/** Static file that exists purely so Netlify can detect the forms at build time. */
export const FORM_ACTION = "/__forms.html";

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "url" | "number" | "date" | "textarea" | "select" | "checkbox";
  required?: boolean;
  hint?: string;
  options?: string[];
  placeholder?: string;
  /** Lower bound for a number field. */
  min?: number;
  /** Earliest date allowed, counted from the day the form is opened. */
  minDaysAhead?: number;
  /** Turns the "%s" in a checkbox label into a link. */
  link?: { text: string; href: string };
};

export type FormSpec = {
  /** Netlify form name. Must match a declaration in public/__forms.html. */
  name: string;
  fields: Field[];
  submit: string;
  /** The reassuring line beside the submit button. */
  note: string;
  /** Replaces the form once it has been sent. */
  done: { title: string; body: string };
};

const countries = [...chapters.map((c) => c.name), "Somewhere else"];

const conduct: Field = {
  name: "conduct",
  label: "I have read the %s and will run it by them.",
  type: "checkbox",
  required: true,
  link: { text: "code of conduct", href: "/code-of-conduct" },
};

export const chapterForm: FormSpec = {
  name: "chapter-application",
  submit: "Send application",
  note: "No cost, no deadline. We reply to everyone.",
  done: {
    title: "Application received",
    body: "Thank you. We read every one and reply within about a week, usually sooner. While you wait, join the Discord and say hello: that's where your first members will come from.",
  },
  fields: [
    { name: "name", label: "Your name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "city",
      label: "City",
      type: "text",
      required: true,
      placeholder: "London",
      hint: `We're actively looking for leads in ${listCities(formingCities)}, and anywhere else you name.`,
    },
    { name: "country", label: "Country", type: "select", required: true, options: countries },
    {
      name: "background",
      label: "What you do",
      type: "text",
      required: true,
      placeholder: "Final year CS student, IIT Madras",
      hint: "Student, researcher, engineer, teacher: whatever fits.",
    },
    {
      name: "coleads",
      label: "Who is with you",
      type: "textarea",
      hint: "Chapters run best with three people. Names and roles if you have them, or tell us you're looking.",
    },
    {
      name: "plan",
      label: "Why your city, and what you would run first",
      type: "textarea",
      required: true,
      hint: "A meetup, a study circle, a campus workshop. Small and specific beats ambitious and vague.",
    },
    { name: "links", label: "A link to you", type: "text", placeholder: "LinkedIn, GitHub or a site" },
    { ...conduct, label: "I have read the %s and will run my chapter by it." },
  ],
};

/** How far ahead an event has to be for us to have time to ship swag and budget food. */
export const LEAD_DAYS = 45;

export const eventForm: FormSpec = {
  name: "event-support",
  submit: "Send request",
  note: `Ask at least ${LEAD_DAYS} days before the event. We reply within a week.`,
  done: {
    title: "Request received",
    body: "Thank you. We'll come back within a week with what we can cover, and questions if we have any. Join the Discord in the meantime: we can put your event in front of everyone nearby.",
  },
  fields: [
    { name: "organiser", label: "Your name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "phone",
      label: "Phone or WhatsApp",
      type: "tel",
      hint: "So we can reach you while the event is being set up.",
    },
    {
      name: "org",
      label: "Who is running it",
      type: "text",
      required: true,
      placeholder: "Quantum Computing Club, IIT Madras",
      hint: "A university club, a lab, a company or an informal group. Say so if it's just you.",
    },
    {
      name: "organiserLinks",
      label: "A link to you or your group",
      type: "url",
      placeholder: "https://linkedin.com/in/...",
    },
    { name: "title", label: "Event name", type: "text", required: true, placeholder: "Qiskit Fall Fest Kochi" },
    {
      name: "format",
      label: "Format",
      type: "select",
      required: true,
      options: ["Meetup", "Workshop", "Hackathon", "Talk or panel", "Conference", "Study circle or course", "Something else"],
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
      minDaysAhead: LEAD_DAYS,
      hint: `At least ${LEAD_DAYS} days out, so swag reaches you and we can budget the food.`,
    },
    { name: "city", label: "City", type: "text", required: true, placeholder: "Kochi" },
    { name: "country", label: "Country", type: "select", required: true, options: countries },
    {
      name: "venue",
      label: "Venue",
      type: "textarea",
      required: true,
      hint: "Name and address. If it's online, name the platform instead.",
    },
    {
      name: "attendees",
      label: "Expected attendance",
      type: "number",
      required: true,
      min: 1,
      placeholder: "80",
      hint: "Your honest estimate, not the seat count.",
    },
    {
      name: "registration",
      label: "Registration link",
      type: "url",
      required: true,
      placeholder: "https://luma.com/...",
      hint: "Luma, Eventbrite, a form: anything people sign up on. A draft page is fine.",
    },
    {
      name: "about",
      label: "What the event is, and who it's for",
      type: "textarea",
      required: true,
      hint: "The agenda, the speakers you have lined up, and who you expect in the room.",
    },
    {
      name: "support",
      label: "What you need from us",
      type: "select",
      required: true,
      options: ["Swag", "Food and drinks", "Both"],
    },
    {
      name: "needs",
      label: "What that looks like",
      type: "textarea",
      required: true,
      hint: "Headcount for food, rough numbers and tee sizes for swag, and a quote or a per-head cost if you have one.",
    },
    {
      name: "branding",
      label: "QuantumX goes on the event page and the slides as a supporter, and I'll send photos and a headcount afterwards.",
      type: "checkbox",
      required: true,
    },
    { ...conduct, label: "I have read the %s and will run the event by it." },
  ],
};
