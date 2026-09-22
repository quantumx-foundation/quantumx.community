import type { FormSubmittedEvent } from "@netlify/functions";
import { chapterAck, eventAck } from "../lib/ack-email.js";
import { applicantName, applicationPlace, renderApplicationEmail, renderApplicationText } from "../lib/application-email.js";
import { eventPlace, eventTitle, renderEventEmail, renderEventText } from "../lib/event-email.js";
import type { Submission } from "../lib/email.js";

type Letter = { subject: string; html: string; text: string };

/** One entry per form declared in public/__forms.html. */
const forms: Record<string, { alert: (data: Submission) => Letter; ack: (data: Submission) => Letter }> = {
  "chapter-application": {
    alert: (data) => ({
      subject: `Chapter application: ${applicationPlace(data)} (${applicantName(data)})`,
      html: renderApplicationEmail(data),
      text: renderApplicationText(data),
    }),
    ack: chapterAck,
  },
  "event-support": {
    alert: (data) => ({
      subject: `Event support: ${eventTitle(data)} (${eventPlace(data)})`,
      html: renderEventEmail(data),
      text: renderEventText(data),
    }),
    ack: eventAck,
  },
};

/** Enough to catch a typo'd or empty address before we hand it to Resend. */
function emailAddress(value: unknown) {
  const address = typeof value === "string" ? value.trim() : "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ? address : undefined;
}

/**
 * Posts one email through Resend. Never throws: a failed acknowledgement must
 * not take the alert down with it, and the submission is already saved either way.
 */
async function send(key: string, mail: Letter & { to: string; replyTo?: string; label: string }) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "QuantumX Community <onboarding@resend.dev>",
        to: [mail.to],
        reply_to: mail.replyTo,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      }),
    });
    if (!response.ok) {
      console.error(`Resend rejected the ${mail.label}:`, response.status, await response.text());
    }
  } catch (error) {
    console.error(`Could not send the ${mail.label}:`, error);
  }
}

/**
 * Emails a form submission to the events inbox through Resend, and sends the
 * person who filled it in a short acknowledgement.
 * Runs after Netlify has verified the submission, so it cannot be hit directly.
 *
 * Env vars: RESEND_API_KEY (required), RESEND_FROM and APPLICATIONS_TO (optional).
 */
const handlers = {
  async formSubmitted(event: FormSubmittedEvent) {
    const data = (event.data ?? {}) as Submission;
    const form = forms[String(data["form-name"] ?? "")];
    if (!form) {
      console.warn("No alert is configured for form:", data["form-name"]);
      return;
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is not set; skipping the alert email.");
      return;
    }

    const inbox = process.env.APPLICATIONS_TO ?? "events@quantumx.community";
    const sender = emailAddress(data.email);

    const mails = [{ ...form.alert(data), to: inbox, replyTo: sender, label: "alert" }];
    if (sender) {
      // Replies to the acknowledgement should reach the team, not bounce back
      // to the sender's own address.
      mails.push({ ...form.ack(data), to: sender, replyTo: inbox, label: "acknowledgement" });
    } else {
      console.warn("No usable email on the submission; skipping the acknowledgement.");
    }

    await Promise.all(mails.map((mail) => send(key, mail)));
  },
};

export default handlers;
