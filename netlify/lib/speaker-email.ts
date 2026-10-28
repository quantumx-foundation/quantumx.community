/** The speaker application, rendered into the shared email shell. */

import {
  type Entry,
  type Submission,
  blank,
  escapeHtml,
  emailAddress,
  mailtoLink,
  reader,
  renderEmail,
  renderLink,
  renderText,
} from "./email.js";

export function speakerName(data: Submission) {
  return reader(data)("name") || "Someone";
}

export function renderSpeakerEmail(data: Submission) {
  const get = reader(data);
  const name = speakerName(data);
  const email = emailAddress(get("email"));

  const entries: Entry[] = [
    ["Name", escapeHtml(name)],
    ["Email", email ? mailtoLink(email) : escapeHtml(get("email")) || blank],
    ["Phone", escapeHtml(get("phone")) || blank],
    ["LinkedIn or X", get("social") ? renderLink(get("social")) : blank],
    ["Where they work", escapeHtml(get("workplace")) || blank],
    ["Title", escapeHtml(get("jobTitle")) || blank],
  ];

  return renderEmail({
    eyebrow: "New speaker",
    heading: `${escapeHtml(name)} wants to speak at QuantumX.`,
    preheader: `${name} applied to speak at a QuantumX event.`,
    entries,
    reply: email
      ? {
          email,
          label: `Reply to ${name.split(" ")[0] || name}`,
          subject: "Speaking at QuantumX",
        }
      : undefined,
    source: { label: "speaker form", url: "https://quantumx.community/speakers" },
  });
}

export function renderSpeakerText(data: Submission) {
  const intro = `${speakerName(data)} wants to speak at QuantumX.`;
  return renderText(intro, data, ["name", "email", "phone", "social", "workplace", "jobTitle"]);
}
