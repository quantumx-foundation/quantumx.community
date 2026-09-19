import type { FormSubmittedEvent } from "@netlify/functions";
import { applicantName, applicationPlace, renderApplicationEmail, renderApplicationText } from "../lib/application-email.js";
import { eventPlace, eventTitle, renderEventEmail, renderEventText } from "../lib/event-email.js";
import type { Submission } from "../lib/email.js";

type Alert = { subject: string; html: string; text: string };

/** One entry per form declared in public/__forms.html. */
const forms: Record<string, (data: Submission) => Alert> = {
  "chapter-application": (data) => ({
    subject: `Chapter application: ${applicationPlace(data)} (${applicantName(data)})`,
    html: renderApplicationEmail(data),
    text: renderApplicationText(data),
  }),
  "event-support": (data) => ({
    subject: `Event support: ${eventTitle(data)} (${eventPlace(data)})`,
    html: renderEventEmail(data),
    text: renderEventText(data),
  }),
};

/**
 * Emails a form submission to the events inbox through Resend.
 * Runs after Netlify has verified the submission, so it cannot be hit directly.
 *
 * Env vars: RESEND_API_KEY (required), RESEND_FROM and APPLICATIONS_TO (optional).
 */
const handlers = {
  async formSubmitted(event: FormSubmittedEvent) {
    const data = (event.data ?? {}) as Submission;
    const build = forms[String(data["form-name"] ?? "")];
    if (!build) {
      console.warn("No alert is configured for form:", data["form-name"]);
      return;
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is not set; skipping the alert email.");
      return;
    }

    const alert = build(data);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "QuantumX Community <onboarding@resend.dev>",
        to: [process.env.APPLICATIONS_TO ?? "events@quantumx.community"],
        reply_to: typeof data.email === "string" ? data.email : undefined,
        subject: alert.subject,
        html: alert.html,
        text: alert.text,
      }),
    });

    if (!response.ok) {
      console.error("Resend rejected the alert:", response.status, await response.text());
    }
  },
};

export default handlers;
