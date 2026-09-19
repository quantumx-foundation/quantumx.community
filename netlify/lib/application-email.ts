/** The chapter application, rendered into the shared email shell. */

import {
  type Entry,
  type Submission,
  blank,
  C,
  escapeHtml,
  escapeMultiline,
  mailtoLink,
  reader,
  renderEmail,
  renderLink,
  renderText,
} from "./email.js";

export type Application = Submission;

/** "City, Country", or a stand-in when the applicant named neither. */
export function applicationPlace(data: Application) {
  const get = reader(data);
  return [get("city"), get("country")].filter(Boolean).join(", ") || "a new city";
}

export function applicantName(data: Application) {
  return reader(data)("name") || "Someone";
}

export function renderApplicationEmail(data: Application) {
  const get = reader(data);
  const name = applicantName(data);
  const where = applicationPlace(data);
  const email = get("email");

  const entries: Entry[] = [
    ["Name", escapeHtml(name)],
    ["Email", email ? mailtoLink(email) : blank],
    ["City", escapeHtml(get("city")) || blank],
    ["Country", escapeHtml(get("country")) || blank],
    ["What they do", escapeMultiline(get("background")) || blank],
    ["Who is with them", escapeMultiline(get("coleads")) || blank],
    ["Why this city, and what they would run first", escapeMultiline(get("plan")) || blank],
    ["A link to them", get("links") ? renderLink(get("links")) : blank],
    ["Code of conduct", get("conduct") ? "Accepted" : `<span style="color:${C.muted};">Not confirmed</span>`],
  ];

  return renderEmail({
    eyebrow: "New chapter application",
    heading: `${escapeHtml(name)} wants to start a chapter in ${escapeHtml(where)}.`,
    preheader: `${name} wants to start a QuantumX chapter in ${where}.`,
    entries,
    reply: email
      ? {
          email,
          label: `Reply to ${name.split(" ")[0] || name}`,
          subject: `Your QuantumX chapter application (${where})`,
        }
      : undefined,
    source: { label: "chapter application form", url: "https://quantumx.community/chapters/apply" },
  });
}

export function renderApplicationText(data: Application) {
  const intro = `${applicantName(data)} wants to start a QuantumX chapter in ${applicationPlace(data)}.`;
  return renderText(intro, data, ["name", "email", "city", "country", "background", "coleads", "plan", "links"]);
}
