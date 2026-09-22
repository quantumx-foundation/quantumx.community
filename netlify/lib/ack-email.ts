/**
 * The short thank-you that goes back to whoever sent a form, so nobody is left
 * wondering whether the site swallowed their submission.
 *
 * Kept deliberately brief: what we have, when we reply, one thing to do while
 * they wait. The detail is already in the alert that reaches the team.
 */

import { applicationPlace } from "./application-email.js";
import { type Submission, escapeHtml, reader, renderNote } from "./email.js";
import { eventTitle } from "./event-email.js";

/** Kept in step with DISCORD_URL in src/lib/site.ts. */
const DISCORD_URL = "https://discord.gg/2w3pgqTQY";

export type Ack = { subject: string; html: string; text: string };

/** What to call someone in a greeting, from whatever they typed in the name field. */
function firstName(full: string) {
  return full.trim().split(/\s+/)[0] || "there";
}

export function chapterAck(data: Submission): Ack {
  const where = applicationPlace(data);
  const name = firstName(reader(data)("name"));

  return {
    subject: `We have your QuantumX chapter application (${where})`,
    html: renderNote({
      eyebrow: "Application received",
      heading: `Thanks, ${escapeHtml(name)}. Your application to start a chapter in ${escapeHtml(where)} is with us.`,
      preheader: `We have your chapter application for ${where}. We reply within about a week.`,
      lines: [
        "We read every one and reply within about a week, usually sooner.",
        "Join the Discord while you wait: that is where your first members come from.",
      ],
      cta: { href: DISCORD_URL, label: "Join the Discord" },
      because: "You applied to start a chapter on quantumx.community.",
    }),
    text: [
      `Thanks, ${name}. Your application to start a QuantumX chapter in ${where} is with us.`,
      "",
      "We read every one and reply within about a week, usually sooner.",
      `Join the Discord while you wait: ${DISCORD_URL}`,
      "",
      "You applied to start a chapter on quantumx.community. Reply to this email if anything needs correcting.",
      "",
    ].join("\n"),
  };
}

export function eventAck(data: Submission): Ack {
  const title = eventTitle(data);
  const name = firstName(reader(data)("organiser"));

  return {
    subject: `We have your QuantumX support request (${title})`,
    html: renderNote({
      eyebrow: "Request received",
      heading: `Thanks, ${escapeHtml(name)}. Your support request for ${escapeHtml(title)} is with us.`,
      preheader: `We have your support request for ${title}. We reply within a week.`,
      lines: [
        "We will come back within a week with what we can cover, and questions if we have any.",
        "Join the Discord in the meantime: we can put your event in front of everyone nearby.",
      ],
      cta: { href: DISCORD_URL, label: "Join the Discord" },
      because: "You asked QuantumX to support an event on quantumx.community.",
    }),
    text: [
      `Thanks, ${name}. Your support request for ${title} is with us.`,
      "",
      "We will come back within a week with what we can cover, and questions if we have any.",
      `Join the Discord in the meantime: ${DISCORD_URL}`,
      "",
      "You asked QuantumX to support an event on quantumx.community. Reply to this email if anything needs correcting.",
      "",
    ].join("\n"),
  };
}
