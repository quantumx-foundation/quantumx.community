import { chapters, formingCities, listCities } from "./site";

export const FORM_NAME = "chapter-application";
/** Static file that exists purely so Netlify can detect the form at build time. */
export const FORM_ACTION = "/__forms.html";

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox";
  required?: boolean;
  hint?: string;
  options?: string[];
  placeholder?: string;
};

export const fields: Field[] = [
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
  {
    name: "country",
    label: "Country",
    type: "select",
    required: true,
    options: [...chapters.map((c) => c.name), "Somewhere else"],
  },
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
  {
    name: "links",
    label: "A link to you",
    type: "text",
    placeholder: "LinkedIn, GitHub or a site",
  },
  {
    name: "conduct",
    label: "I have read the code of conduct and will run my chapter by it.",
    type: "checkbox",
    required: true,
  },
];
