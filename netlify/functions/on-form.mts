import type { FormSubmittedEvent } from "@netlify/functions";

/**
 * Emails a chapter application to the events inbox through Resend.
 * Runs after Netlify has verified the submission, so it cannot be hit directly.
 *
 * Env vars: RESEND_API_KEY (required), RESEND_FROM and APPLICATIONS_TO (optional).
 */
const handlers = {
  async formSubmitted(event: FormSubmittedEvent) {
    if (event.data?.["form-name"] && event.data["form-name"] !== "chapter-application") return;

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is not set; skipping the application alert email.");
      return;
    }

    const data = event.data ?? {};
    const applicant = String(data.name ?? "Someone");
    const where = [data.city, data.country].filter(Boolean).join(", ");
    const lines = ["name", "email", "city", "country", "background", "coleads", "plan", "links"]
      .map((field) => `${field}: ${data[field] || "(blank)"}`)
      .join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "QuantumX Community <onboarding@resend.dev>",
        to: [process.env.APPLICATIONS_TO ?? "events@quantumx.community"],
        reply_to: typeof data.email === "string" ? data.email : undefined,
        subject: `Chapter application: ${where || "new city"} (${applicant})`,
        text: `${applicant} wants to start a QuantumX chapter in ${where || "a new city"}.\n\n${lines}\n`,
      }),
    });

    if (!response.ok) {
      console.error("Resend rejected the alert:", response.status, await response.text());
    }
  },
};

export default handlers;
