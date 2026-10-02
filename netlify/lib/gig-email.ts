/** A role posted to the gig board, rendered into the shared email shell. */

import {
  type Entry,
  type Submission,
  blank,
  escapeHtml,
  escapeMultiline,
  mailtoLink,
  reader,
  renderEmail,
  renderLink,
  renderText,
} from "./email.js";

export function gigRole(data: Submission) {
  return reader(data)("role") || "a role";
}

export function gigCompany(data: Submission) {
  return reader(data)("company") || "a company";
}

export function renderGigEmail(data: Submission) {
  const get = reader(data);
  const role = gigRole(data);
  const company = gigCompany(data);
  const email = get("email");
  const contact = get("contact") || "Someone";

  const entries: Entry[] = [
    ["Role", escapeHtml(role)],
    ["Company or lab", escapeHtml(company)],
    ["Location", escapeHtml(get("location")) || blank],
    ["Where the work happens", escapeHtml(get("setup")) || blank],
    ["Type", escapeHtml(get("type")) || blank],
    ["Listing", get("url") ? renderLink(get("url")) : blank],
    ["Closes", escapeHtml(get("closes")) || "Open until filled"],
    ["Anything we should know", escapeMultiline(get("about")) || blank],
    ["Posted by", escapeHtml(contact)],
    ["Email", email ? mailtoLink(email) : blank],
  ];

  return renderEmail({
    eyebrow: "New gig board role",
    heading: `${escapeHtml(company)} wants to list ${escapeHtml(role)} on the gig board.`,
    preheader: `${role} at ${company}. Check the listing, then add it to src/content/gigs.ts.`,
    entries,
    reply: email
      ? {
          email,
          label: `Reply to ${contact.split(" ")[0] || contact}`,
          subject: `Your QuantumX gig board listing (${role})`,
        }
      : undefined,
    source: { label: "gig board form", url: "https://quantumx.community/gigs" },
  });
}

export function renderGigText(data: Submission) {
  const intro = `${gigCompany(data)} wants to list ${gigRole(data)} on the QuantumX gig board.`;
  return renderText(intro, data, ["role", "company", "location", "setup", "type", "url", "closes", "about", "contact", "email"]);
}
