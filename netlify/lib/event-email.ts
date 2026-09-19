/** The event support request, rendered into the shared email shell. */

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

/** Kept in step with LEAD_DAYS in src/lib/forms.ts. */
const LEAD_DAYS = 45;

export type EventRequest = Submission;

export function organiserName(data: EventRequest) {
  return reader(data)("organiser") || "Someone";
}

export function eventTitle(data: EventRequest) {
  return reader(data)("title") || "an event";
}

export function eventPlace(data: EventRequest) {
  const get = reader(data);
  return [get("city"), get("country")].filter(Boolean).join(", ") || "somewhere";
}

/**
 * Whole days between today and the event. The form asks for a date only, so
 * both sides are compared at UTC midnight and the result is a clean day count.
 */
function daysAway(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const event = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(event)) return null;
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((event - today) / 86_400_000);
}

/** "12 March 2027", with the raw value kept if it isn't a date we can parse. */
function longDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The short lead time, if there is one: shown in the email and worth a reply either way. */
export function leadTimeWarning(data: EventRequest) {
  const days = daysAway(reader(data)("date"));
  if (days === null || days >= LEAD_DAYS) return undefined;
  if (days < 0) return `This date has already passed. Check it before replying.`;
  return `Only ${days} ${days === 1 ? "day" : "days"} away. We ask for ${LEAD_DAYS}, so swag may not arrive in time.`;
}

export function renderEventEmail(data: EventRequest) {
  const get = reader(data);
  const name = organiserName(data);
  const title = eventTitle(data);
  const where = eventPlace(data);
  const email = get("email");
  const days = daysAway(get("date"));

  const when = get("date")
    ? `${escapeHtml(longDate(get("date")))}${days !== null && days >= 0 ? `<span style="color:${C.muted};"> · in ${days} ${days === 1 ? "day" : "days"}</span>` : ""}`
    : blank;

  const entries: Entry[] = [
    ["What they need", escapeHtml(get("support")) || blank],
    ["What that looks like", escapeMultiline(get("needs")) || blank],
    ["Event", escapeHtml(title)],
    ["Format", escapeHtml(get("format")) || blank],
    ["Date", when],
    ["Where", escapeHtml(where)],
    ["Venue", escapeMultiline(get("venue")) || blank],
    ["Expected attendance", escapeHtml(get("attendees")) || blank],
    ["Registration", get("registration") ? renderLink(get("registration")) : blank],
    ["What the event is, and who it's for", escapeMultiline(get("about")) || blank],
    ["Organiser", escapeHtml(name)],
    ["Running it", escapeHtml(get("org")) || blank],
    ["Email", email ? mailtoLink(email) : blank],
    ["Phone", escapeHtml(get("phone")) || blank],
    ["A link to them", get("organiserLinks") ? renderLink(get("organiserLinks")) : blank],
    [
      "Branding and photos",
      get("branding") ? "Agreed" : `<span style="color:${C.muted};">Not confirmed</span>`,
    ],
    ["Code of conduct", get("conduct") ? "Accepted" : `<span style="color:${C.muted};">Not confirmed</span>`],
  ];

  const asking = get("support") ? get("support").toLowerCase() : "support";

  return renderEmail({
    eyebrow: "Event support request",
    heading: `${escapeHtml(name)} is running ${escapeHtml(title)} in ${escapeHtml(where)} and is asking for ${escapeHtml(asking)}.`,
    preheader: `${title} in ${where}${get("date") ? `, ${longDate(get("date"))}` : ""}: asking for ${asking}.`,
    flag: leadTimeWarning(data),
    entries,
    reply: email
      ? {
          email,
          label: `Reply to ${name.split(" ")[0] || name}`,
          subject: `Your QuantumX event support request (${title})`,
        }
      : undefined,
    source: { label: "event support form", url: "https://quantumx.community/events/support" },
  });
}

export function renderEventText(data: EventRequest) {
  const get = reader(data);
  const intro = `${organiserName(data)} is running ${eventTitle(data)} in ${eventPlace(data)} and is asking for ${get("support") || "support"}.`;
  const warning = leadTimeWarning(data);
  return renderText(warning ? `${intro}\n${warning}` : intro, data, [
    "support",
    "needs",
    "title",
    "format",
    "date",
    "city",
    "country",
    "venue",
    "attendees",
    "registration",
    "about",
    "organiser",
    "org",
    "email",
    "phone",
    "organiserLinks",
  ]);
}
