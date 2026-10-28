import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";
import type { FormSubmittedEvent } from "@netlify/functions";
import { chapterAck, discordInvite, eventAck, gigAck, speakerAck, volunteerAck } from "../lib/ack-email.js";
import { applicantName, applicationPlace, renderApplicationEmail, renderApplicationText } from "../lib/application-email.js";
import { eventPlace, eventTitle, renderEventEmail, renderEventText } from "../lib/event-email.js";
import { emailAddress, type Submission } from "../lib/email.js";
import { gigCompany, gigRole, renderGigEmail, renderGigText } from "../lib/gig-email.js";
import { renderSpeakerEmail, renderSpeakerText, speakerName } from "../lib/speaker-email.js";
import { renderVolunteerEmail, renderVolunteerText, volunteerName, volunteerPlace } from "../lib/volunteer-email.js";

type Letter = { subject: string; html: string; text: string };

type Pool = "acks" | "invites";

/**
 * One entry per form declared in public/__forms.html. `alert` goes to the team,
 * `ack` to the sender, counted against `pool` (acks unless it says otherwise).
 */
const forms: Record<string, { alert?: (data: Submission) => Letter; ack: () => Letter; pool?: Pool }> = {
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
  volunteer: {
    alert: (data) => ({
      subject: `Volunteer: ${volunteerPlace(data)} (${volunteerName(data)})`,
      html: renderVolunteerEmail(data),
      text: renderVolunteerText(data),
    }),
    ack: volunteerAck,
  },
  gig: {
    alert: (data) => ({
      subject: `Gig board: ${gigRole(data)} (${gigCompany(data)})`,
      html: renderGigEmail(data),
      text: renderGigText(data),
    }),
    ack: gigAck,
  },
  speaker: {
    alert: (data) => ({
      subject: `Speaker: ${speakerName(data)}`,
      html: renderSpeakerEmail(data),
      text: renderSpeakerText(data),
    }),
    ack: speakerAck,
  },
  // No alert: the team reads Discord signups in Netlify. The sender gets the invite.
  discord: {
    ack: discordInvite,
    pool: "invites",
  },
};

/**
 * Daily ceilings, kept under Resend's free tier of 100 emails a day so a spam
 * run can never use up the sends a real application needs. Alerts get the
 * largest share: those are the ones the team cannot miss. Discord invites have
 * their own pool, so a rush of signups never costs an applicant their ack.
 */
const ALERTS_PER_DAY = 40;
const CAPS: Record<Pool, number> = { acks: 25, invites: 30 };

type Day = { alerts: number } & Record<Pool, number>;

/** Counters and per-address marks, so limits hold across invocations. */
function limits() {
  return getStore({ name: "form-limits", consistency: "strong" });
}

/** The day's counters, keyed by UTC date. */
async function readDay(today: string): Promise<Day> {
  const day = (await limits().get(`day/${today}`, { type: "json" })) as Day | null;
  return { alerts: day?.alerts ?? 0, acks: day?.acks ?? 0, invites: day?.invites ?? 0 };
}

/** One mark per address per pool per day, stored as a hash so the store holds no email addresses. */
function addressKey(pool: Pool, address: string) {
  const prefix = pool === "acks" ? "ack" : "invite";
  return `${prefix}/${createHash("sha256").update(address.toLowerCase()).digest("hex")}`;
}

/**
 * Checks the Cloudflare Turnstile token the form sent. Passes when no secret
 * is configured, so the forms keep working before Turnstile is set up.
 */
async function passesTurnstile(token: string | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    // Cloudflare being down should not cost us a real application.
    console.error("Could not reach Turnstile; letting the submission through:", error);
    return true;
  }
}

/** A field only that form has, for when Netlify hands over the fields without the form's name. */
const telltales: [field: string, form: string][] = [
  ["plan", "chapter-application"],
  ["organiser", "event-support"],
  ["availability", "volunteer"],
  ["role", "gig"],
  ["jobTitle", "speaker"],
  ["source", "discord"],
];

/**
 * The form's name and its fields. Netlify strips form-name from the fields
 * and keeps it as form_name on the submission, and the event may carry
 * either the fields alone or the whole submission with the fields under
 * data, so every shape is tried before falling back to telltale fields.
 */
function readSubmission(event: FormSubmittedEvent) {
  const outer = (event.data ?? {}) as Record<string, unknown>;
  const inner = outer.data && typeof outer.data === "object" ? (outer.data as Record<string, unknown>) : undefined;
  const data = (inner ?? outer) as Submission;
  const declared = outer.form_name ?? (event as unknown as Record<string, unknown>).form_name ?? data["form-name"];
  const name = typeof declared === "string" && declared ? declared : telltales.find(([field]) => field in data)?.[1] ?? "";
  return { name, data };
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
      // 429 and 403 mean the quota or the key is gone, and every form after this one is failing too.
      const quota = response.status === 429 || response.status === 403 ? " RESEND QUOTA OR KEY PROBLEM:" : "";
      console.error(`Resend rejected the ${mail.label}:${quota}`, response.status, await response.text());
    }
  } catch (error) {
    console.error(`Could not send the ${mail.label}:`, error);
  }
}

/**
 * Emails a form submission to the events inbox through Resend, and sends the
 * person who filled it in a short acknowledgement (for the Discord form, the
 * invite instead, with no alert to the team).
 * Runs after Netlify has verified the submission, so it cannot be hit directly.
 * Netlify still stores every submission, so nothing is lost when a limit or
 * the Turnstile check stops an email.
 *
 * Env vars: RESEND_API_KEY (required), RESEND_FROM, APPLICATIONS_TO and
 * TURNSTILE_SECRET_KEY (optional).
 */
const handlers = {
  async formSubmitted(event: FormSubmittedEvent) {
    const { name, data } = readSubmission(event);
    const form = forms[name];
    if (!form) {
      // Names only, never values: these logs are not the place for applicants' details.
      console.warn("No alert is configured for form:", name || "(unknown)", "fields:", Object.keys(data).join(", "));
      return;
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is not set; skipping the alert email.");
      return;
    }

    if (!(await passesTurnstile(data["cf-turnstile-response"]))) {
      console.warn(`Turnstile check failed on a ${name} submission; no email sent.`);
      return;
    }

    const inbox = process.env.APPLICATIONS_TO ?? "events@quantumx.community";
    const sender = emailAddress(data.email);
    const today = new Date().toISOString().slice(0, 10);

    // If the store cannot be read, still send the alert (the team must hear about
    // real submissions) but not the acknowledgement, which is what spam is after.
    let day: Day | null = null;
    try {
      day = await readDay(today);
    } catch (error) {
      console.error("Could not read the form limits; sending the alert only:", error);
    }

    const mails: (Letter & { to: string; replyTo?: string; label: string })[] = [];
    if (!form.alert) {
      // Nothing for the team on this form.
    } else if (!day || day.alerts < ALERTS_PER_DAY) {
      mails.push({ ...form.alert(data), to: inbox, replyTo: sender, label: "alert" });
    } else {
      console.error(`DAILY ALERT CAP REACHED (${ALERTS_PER_DAY}): ${name} submission kept in Netlify, not emailed.`);
    }

    const pool = form.pool ?? "acks";
    const label = pool === "acks" ? "acknowledgement" : "invite";
    if (!sender) {
      console.warn(`No usable email on the submission; skipping the ${label}.`);
    } else if (day && day[pool] >= CAPS[pool]) {
      console.warn(`Daily ${label} cap reached (${CAPS[pool]}); skipping it.`);
    } else if (day) {
      try {
        const store = limits();
        const mark = addressKey(pool, sender);
        if ((await store.get(mark, { type: "text" })) === today) {
          console.warn(`This address already had an ${label} today; skipping it.`);
        } else {
          await store.set(mark, today);
          // Replies to the acknowledgement should reach the team, not bounce back
          // to the sender's own address.
          mails.push({ ...form.ack(), to: sender, replyTo: inbox, label });
        }
      } catch (error) {
        console.error("Could not check the address limit; skipping the acknowledgement:", error);
      }
    }

    if (day) {
      const count = (label: string) => mails.filter((mail) => mail.label === label).length;
      const next: Day = {
        alerts: day.alerts + count("alert"),
        acks: day.acks + count("acknowledgement"),
        invites: day.invites + count("invite"),
      };
      // Read then write is not atomic, so two submissions in the same instant can
      // both count from the same number. The caps are well under Resend's limit,
      // so a count that runs slightly low is harmless.
      await limits()
        .setJSON(`day/${today}`, next)
        .catch((error) => console.error("Could not update the form limits:", error));
    }

    await Promise.all(mails.map((mail) => send(key, mail)));
  },
};

export default handlers;
