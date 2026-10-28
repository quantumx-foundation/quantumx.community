/**
 * The short thank-you that goes back to whoever sent a form, so nobody is left
 * wondering whether the site swallowed their submission.
 *
 * Kept deliberately brief: what we have, when we reply, one thing to do while
 * they wait. The detail is already in the alert that reaches the team.
 *
 * Nothing the sender typed goes into these. The address on a form is not
 * verified, so anything we echoed back (a name, an event title) would let
 * anyone send their own words to any inbox from our domain.
 */

import { renderNote } from "./email.js";

/** Kept in step with DISCORD_URL in src/lib/site.ts, tagged the way inviteFor() tags the site's links. */
const DISCORD_URL = "https://discord.gg/xC6h4ZfzEP?utm_source=quantumx.community&utm_medium=email";

export type Ack = { subject: string; html: string; text: string };

function ack({
  subject,
  eyebrow,
  heading,
  preheader,
  lines,
  because,
}: {
  subject: string;
  eyebrow: string;
  heading: string;
  preheader: string;
  /** Two lines: when we reply, then why to join the Discord. The second is followed by the invite. */
  lines: [string, string];
  because: string;
}): Ack {
  const footnote = `${because} If this wasn't you, you can ignore this email.`;
  return {
    subject,
    html: renderNote({
      eyebrow,
      heading,
      preheader,
      lines,
      cta: { href: DISCORD_URL, label: "Join the Discord" },
      because: footnote,
    }),
    text: [
      heading,
      "",
      lines[0],
      `${lines[1]} ${DISCORD_URL}`,
      "",
      footnote,
      "",
    ].join("\n"),
  };
}

export function chapterAck(): Ack {
  return ack({
    subject: "We have your QuantumX chapter application",
    eyebrow: "Application received",
    heading: "Thanks. Your application to start a QuantumX chapter is with us.",
    preheader: "We have your chapter application. We reply within about a week.",
    lines: [
      "We read every one and reply within about a week, usually sooner.",
      "Join the Discord while you wait: that is where your first members come from.",
    ],
    because: "Someone applied to start a chapter on quantumx.community with this address.",
  });
}

export function eventAck(): Ack {
  return ack({
    subject: "We have your QuantumX event support request",
    eyebrow: "Request received",
    heading: "Thanks. Your event support request is with us.",
    preheader: "We have your support request. We reply within a week.",
    lines: [
      "We will come back within a week with what we can cover, and questions if we have any.",
      "Join the Discord in the meantime: we can put your event in front of everyone nearby.",
    ],
    because: "Someone asked QuantumX to support an event on quantumx.community with this address.",
  });
}

export function volunteerAck(): Ack {
  return ack({
    subject: "You're on the QuantumX crew list",
    eyebrow: "Signup received",
    heading: "Thanks. You're on the list to volunteer at QuantumX events.",
    preheader: "We'll reach out before the next QuantumX event near you.",
    lines: [
      "We'll reach out before the next event near you with what we need on the day.",
      "Join the Discord in the meantime: that is where the crew plans each event.",
    ],
    because: "Someone signed up to volunteer on quantumx.community with this address.",
  });
}

export function speakerAck(): Ack {
  return ack({
    subject: "Your QuantumX speaker application",
    eyebrow: "Application received",
    heading: "Thanks for offering to speak at QuantumX.",
    preheader: "We'll be in touch when there's a session that fits.",
    lines: [
      "We'll be in touch when there's a session that fits, usually within a couple of weeks.",
      "Join the Discord in the meantime: that is where chapters look for speakers.",
    ],
    because: "Someone applied to speak at QuantumX on quantumx.community with this address.",
  });
}

/** Sent after the Discord gate, so the invite is in their inbox as well as on the page. */
export function discordInvite(): Ack {
  const heading = "Here's your invite to the QuantumX Discord.";
  const lines: [string, string] = [
    "Chapters, events, study circles and the people behind them, all in one place.",
    "Keep this email: the link works whenever you're ready to join.",
  ];
  const footnote =
    "Someone asked for a QuantumX Discord invite on quantumx.community with this address. If this wasn't you, you can ignore this email.";
  return {
    subject: "Your QuantumX Discord invite",
    html: renderNote({
      eyebrow: "Discord invite",
      heading,
      preheader: "Your invite to the QuantumX Discord, as promised.",
      lines,
      cta: { href: DISCORD_URL, label: "Join the Discord" },
      because: footnote,
    }),
    text: [heading, "", lines[0], lines[1], "", `Join: ${DISCORD_URL}`, "", footnote, ""].join("\n"),
  };
}

export function gigAck(): Ack {
  return ack({
    subject: "We have your QuantumX gig board listing",
    eyebrow: "Listing received",
    heading: "Thanks. Your gig board listing is with us.",
    preheader: "We have your gig board listing. It goes up within a few days.",
    lines: [
      "We check every listing and put it on the board within a few days, then let you know.",
      "Join the Discord to tell the community about it too.",
    ],
    because: "Someone posted a role to the gig board on quantumx.community with this address.",
  });
}
