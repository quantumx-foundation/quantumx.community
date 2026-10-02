/** The volunteer signup, rendered into the shared email shell. */

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

export function volunteerName(data: Submission) {
  return reader(data)("name") || "Someone";
}

/** "City, Country", or a stand-in when they named neither. */
export function volunteerPlace(data: Submission) {
  const get = reader(data);
  return [get("city"), get("country")].filter(Boolean).join(", ") || "somewhere";
}

export function renderVolunteerEmail(data: Submission) {
  const get = reader(data);
  const name = volunteerName(data);
  const where = volunteerPlace(data);
  const email = get("email");
  const notConfirmed = `<span style="color:${C.muted};">Not confirmed</span>`;

  const entries: Entry[] = [
    ["Name", escapeHtml(name)],
    ["Email", email ? mailtoLink(email) : blank],
    ["Phone", escapeHtml(get("phone")) || blank],
    ["City", escapeHtml(get("city")) || blank],
    ["Country", escapeHtml(get("country")) || blank],
    ["What they do", escapeHtml(get("background")) || blank],
    ["How often they can help", escapeHtml(get("availability")) || blank],
    ["Why they want to help", escapeMultiline(get("why")) || blank],
    ["A link to them", get("links") ? renderLink(get("links")) : blank],
    ["Name and photo on the site", get("photo") ? "Agreed" : notConfirmed],
    ["Code of conduct", get("conduct") ? "Accepted" : notConfirmed],
  ];

  return renderEmail({
    eyebrow: "New volunteer",
    heading: `${escapeHtml(name)} wants to volunteer at events in ${escapeHtml(where)}.`,
    preheader: `${name} wants to join the QuantumX crew in ${where}.`,
    entries,
    reply: email
      ? {
          email,
          label: `Reply to ${name.split(" ")[0] || name}`,
          subject: "Volunteering with QuantumX",
        }
      : undefined,
    source: { label: "volunteer form", url: "https://quantumx.community/crew" },
  });
}

export function renderVolunteerText(data: Submission) {
  const intro = `${volunteerName(data)} wants to volunteer at QuantumX events in ${volunteerPlace(data)}.`;
  return renderText(intro, data, ["name", "email", "phone", "city", "country", "background", "availability", "why", "links"]);
}
