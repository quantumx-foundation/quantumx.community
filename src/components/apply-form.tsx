"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui";
import { FORM_ACTION, FORM_NAME, fields } from "@/lib/apply";
import { DISCORD_URL, EVENTS_EMAIL } from "@/lib/site";

const inputClass =
  "mt-3 w-full border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-pink";

function Label({ field }: { field: (typeof fields)[number] }) {
  return (
    <>
      <span className="font-mono text-xs uppercase tracking-wider text-muted">
        {field.label}
        {field.required && <span className="text-pink"> *</span>}
      </span>
      {field.hint && <span className="mt-2 block text-sm text-muted">{field.hint}</span>}
    </>
  );
}

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-pink bg-panel p-8 sm:p-12">
        <p className="font-pixel text-3xl text-pink">Application received</p>
        <p className="mt-6 max-w-xl text-muted">
          Thank you. We read every one and reply within about a week, usually sooner. While you wait, join the
          Discord and say hello: that&apos;s where your first members will come from.
        </p>
        <div className="mt-8">
          <Button href={DISCORD_URL}>Join the Discord</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      name={FORM_NAME}
      method="post"
      action={FORM_ACTION}
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="border border-line bg-panel p-6 sm:p-10"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p hidden>
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {fields.map((field) => {
          const span = field.type === "textarea" || field.type === "checkbox" ? "sm:col-span-2" : "";
          if (field.type === "checkbox") {
            return (
              <label key={field.name} className={`flex items-start gap-3 ${span}`}>
                <input
                  type="checkbox"
                  name={field.name}
                  required={field.required}
                  value="yes"
                  className="mt-1 size-4 accent-pink"
                />
                <span className="text-sm text-muted">
                  I have read the{" "}
                  <Link href="/code-of-conduct" className="text-pink underline decoration-dotted underline-offset-4">
                    code of conduct
                  </Link>{" "}
                  and will run my chapter by it.
                  <span className="text-pink"> *</span>
                </span>
              </label>
            );
          }
          return (
            <label key={field.name} className={`block ${span}`}>
              <Label field={field} />
              {field.type === "textarea" ? (
                <textarea name={field.name} required={field.required} rows={5} className={inputClass} />
              ) : field.type === "select" ? (
                <select name={field.name} required={field.required} defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Pick one
                  </option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex cursor-pointer items-center gap-3 border border-pink bg-pink px-7 py-4 font-pixel text-sm uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send application"}
          <span aria-hidden>→</span>
        </button>
        <p className="text-sm text-muted">No cost, no deadline. We reply to everyone.</p>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-pink">
        {status === "error" && (
          <>
            That didn&apos;t send. Please try again, or email us at{" "}
            <a href={`mailto:${EVENTS_EMAIL}`} className="underline decoration-dotted underline-offset-4">
              {EVENTS_EMAIL}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}
