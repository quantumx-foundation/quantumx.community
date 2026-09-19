"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui";
import { FORM_ACTION, type Field, type FormSpec } from "@/lib/forms";
import { DISCORD_URL, EVENTS_EMAIL } from "@/lib/site";

const inputClass =
  "mt-3 w-full border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-pink";

/**
 * Pins a date input's earliest allowed day, counted from today in the
 * visitor's own timezone. Written to the DOM through a ref rather than
 * rendered: the server has a different clock, and a date in the markup would
 * not survive hydration.
 */
function limitDate(days: number | undefined) {
  if (!days) return undefined;
  return (node: HTMLInputElement | null) => {
    if (!node) return;
    const min = new Date();
    min.setDate(min.getDate() + days);
    node.min = `${min.getFullYear()}-${String(min.getMonth() + 1).padStart(2, "0")}-${String(min.getDate()).padStart(2, "0")}`;
  };
}

function Label({ field }: { field: Field }) {
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

/** A checkbox label, with the "%s" in it turned into a link when the field has one. */
function Consent({ field }: { field: Field }) {
  const [before, after] = field.link ? field.label.split("%s") : [field.label, ""];
  return (
    <label className="flex items-start gap-3 sm:col-span-2">
      <input type="checkbox" name={field.name} required={field.required} value="yes" className="mt-1 size-4 accent-pink" />
      <span className="text-sm text-muted">
        {before}
        {field.link && (
          <>
            <Link href={field.link.href} className="text-pink underline decoration-dotted underline-offset-4">
              {field.link.text}
            </Link>
            {after}
          </>
        )}
        {field.required && <span className="text-pink"> *</span>}
      </span>
    </label>
  );
}

export function ApplyForm({ form }: { form: FormSpec }) {
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
        <p className="font-pixel text-3xl text-pink">{form.done.title}</p>
        <p className="mt-6 max-w-xl text-muted">{form.done.body}</p>
        <div className="mt-8">
          <Button href={DISCORD_URL}>Join the Discord</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      name={form.name}
      method="post"
      action={FORM_ACTION}
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="border border-line bg-panel p-6 sm:p-10"
    >
      <input type="hidden" name="form-name" value={form.name} />
      <p hidden>
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {form.fields.map((field) => {
          if (field.type === "checkbox") return <Consent key={field.name} field={field} />;
          return (
            <label key={field.name} className={`block ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>
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
                  min={field.min}
                  ref={limitDate(field.type === "date" ? field.minDaysAhead : undefined)}
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
          {status === "sending" ? "Sending..." : form.submit}
          <span aria-hidden>→</span>
        </button>
        <p className="text-sm text-muted">{form.note}</p>
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
