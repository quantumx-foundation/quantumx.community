"use client";

import { useState, useSyncExternalStore } from "react";
import { Turnstile } from "./turnstile";
import { Button } from "./ui";
import { FORM_ACTION } from "@/lib/forms";
import { inviteFor } from "@/lib/site";

/** Set once someone has given us their email, so they only ever do it once. */
const UNLOCK_KEY = "qx-discord-unlocked";

function isUnlocked() {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "yes";
  } catch {
    return false;
  }
}

/** Remembers the visitor as unlocked. Also called after any other form that took their email. */
export function unlockDiscord() {
  try {
    localStorage.setItem(UNLOCK_KEY, "yes");
  } catch {
    // Private mode: they'll be asked again on their next visit.
  }
  // Every gate on the page opens together, not just the one they used.
  window.dispatchEvent(new Event(UNLOCK_KEY));
}

function subscribe(onChange: () => void) {
  window.addEventListener(UNLOCK_KEY, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(UNLOCK_KEY, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The ?ref= a short link was shared with, carried onto the invite and the signup. */
function currentRef() {
  return new URLSearchParams(window.location.search).get("ref");
}

/** The ?from= a site button sent them to /join with, so the signup still says which button it was. */
function currentFrom() {
  return new URLSearchParams(window.location.search).get("from")?.slice(0, 40).replace(/[^\w-]/g, "") || null;
}

const inputClass =
  "mt-2 w-full border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-purple";

type Status = "idle" | "sending" | "error";

/**
 * Name and email, posted to the "discord" Netlify form, which emails them the
 * invite (netlify/functions/on-form.mts). Lives on /join.
 */
function GateForm({
  source,
  status,
  attempt,
  onSubmit,
}: {
  source: string;
  status: Status;
  /** Bumped after a failed send, so the Turnstile widget remounts with a fresh token. */
  attempt: number;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      name="discord"
      method="post"
      action={FORM_ACTION}
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="w-full max-w-md"
    >
      <input type="hidden" name="form-name" value="discord" />
      <input type="hidden" name="source" value={source} />
      <p hidden>
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="grid gap-4">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Your name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            maxLength={200}
            placeholder="Ada Lovelace"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Your email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>
        <Turnstile key={attempt} />
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-2 inline-flex cursor-pointer items-center justify-center gap-3 border border-purple bg-purple px-6 py-3 font-pixel text-sm uppercase tracking-[0.2em] text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Get invite"}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 text-sm text-muted">
        {status === "error" ? (
          <span className="text-purple">That didn&apos;t send. Please try again.</span>
        ) : (
          "We'll email you the invite too. Only community news after that, no spam."
        )}
      </p>
    </form>
  );
}

/**
 * "Join the Discord", behind a name and email. Everywhere but /join it is a
 * link to /join?from=<source>, which asks for both; once they're sent to the
 * "discord" Netlify form, every gate becomes the invite button itself.
 * `ask` is /join's mode: the form on the page.
 * `source` tags the invite and the submission with where the visitor came from.
 */
export function DiscordGate({
  label = "Join the Discord",
  source = "site",
  ask = false,
}: {
  label?: string;
  source?: string;
  /** Show the form on the page, for /join. */
  ask?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState(false);
  // The server can't see localStorage, so it always renders the locked gate.
  const unlocked = useSyncExternalStore(subscribe, isUnlocked, () => false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    data.set("source", currentFrom() ?? source);
    data.set("ref", currentRef() ?? "");
    try {
      const response = await fetch(FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("idle");
      setSent(true);
      unlockDiscord();
    } catch {
      setStatus("error");
      setAttempt((n) => n + 1);
    }
  }

  // Only called once unlocked, which never happens on the server: it reads window.location.
  const invite = () => <Button href={inviteFor(currentFrom() ?? source, currentRef())}>{label}</Button>;

  if (!ask) return unlocked ? invite() : <Button href={`/join?from=${source}`}>{label}</Button>;

  if (!unlocked) return <GateForm source={source} status={status} attempt={attempt} onSubmit={onSubmit} />;

  return (
    <div className="flex flex-col items-start gap-4">
      {invite()}
      {sent && <p className="text-sm text-muted">A copy of the invite is on its way to your inbox too.</p>}
    </div>
  );
}
