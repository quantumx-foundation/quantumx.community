"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "./ui";
import { FORM_ACTION } from "@/lib/forms";
import { inviteFor } from "@/lib/site";

/** Set once someone has given us their email, so they only ever do it once. */
const UNLOCK_KEY = "qx-discord-unlocked";

const buttonClass =
  "inline-flex cursor-pointer items-center gap-3 border border-pink px-7 py-4 font-pixel text-sm uppercase tracking-[0.2em] text-pink transition-colors hover:bg-pink hover:text-ink focus-visible:bg-pink focus-visible:text-ink focus-visible:outline-none disabled:opacity-60";

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

/**
 * "Join the Discord", behind an email. The first click opens an email field;
 * once it's sent to the "discord" Netlify form the button becomes the invite.
 * `source` tags the invite and the submission with where the visitor came from.
 */
export function DiscordGate({
  label = "Join the Discord",
  source = "site",
  ask = false,
}: {
  label?: string;
  source?: string;
  /** Show the email field straight away rather than behind a first click. */
  ask?: boolean;
}) {
  const [status, setStatus] = useState<"locked" | "asking" | "sending" | "error">(ask ? "asking" : "locked");
  // The server can't see localStorage, so it always renders the locked gate.
  const unlocked = useSyncExternalStore(subscribe, isUnlocked, () => false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    data.set("ref", currentRef() ?? "");
    try {
      const response = await fetch(FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      unlockDiscord();
    } catch {
      setStatus("error");
    }
  }

  if (unlocked) {
    return <Button href={inviteFor(source, currentRef())}>{label}</Button>;
  }

  if (status === "locked") {
    return (
      <button type="button" onClick={() => setStatus("asking")} className={buttonClass}>
        {label}
        <span aria-hidden>→</span>
      </button>
    );
  }

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
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">Your email, and the invite is yours</span>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            autoFocus={!ask}
            autoComplete="email"
            placeholder="you@example.com"
            className="min-w-0 flex-1 border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-pink"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex cursor-pointer items-center justify-center gap-3 border border-pink bg-pink px-6 py-3 font-pixel text-sm uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Get invite"}
          </button>
        </div>
      </label>
      <p aria-live="polite" className="mt-3 text-sm text-muted">
        {status === "error" ? (
          <span className="text-pink">That didn&apos;t send. Please try again.</span>
        ) : (
          "Only for community news. No spam."
        )}
      </p>
    </form>
  );
}
