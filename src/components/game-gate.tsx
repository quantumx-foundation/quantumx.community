"use client";

import { useState, useSyncExternalStore } from "react";
import { unlockDiscord } from "./discord-gate";
import { FORM_ACTION } from "@/lib/forms";

/** Set once a player has given us their email, so they only ever do it once. */
const PLAYER_KEY = "qx-player-unlocked";
/** Set by the Discord gate and the other forms: they've already given us an email. */
const DISCORD_KEY = "qx-discord-unlocked";

function isUnlocked() {
  try {
    return localStorage.getItem(PLAYER_KEY) === "yes" || localStorage.getItem(DISCORD_KEY) === "yes";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(PLAYER_KEY, onChange);
  window.addEventListener(DISCORD_KEY, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PLAYER_KEY, onChange);
    window.removeEventListener(DISCORD_KEY, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function unlockPlayer() {
  try {
    localStorage.setItem(PLAYER_KEY, "yes");
  } catch {
    // Private mode: they'll be asked again on their next visit.
  }
  window.dispatchEvent(new Event(PLAYER_KEY));
}

type Status = "idle" | "sending" | "error";

/**
 * Asks for an email before Qubit Blaster starts. The address goes to the
 * "player" Netlify form and is only stored there (no email is sent, see
 * netlify/functions/on-form.mts). Anyone who already gave us an email on
 * another form goes straight to the game.
 */
export function GameGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("idle");
  // The server can't see localStorage, so it always renders the form.
  const unlocked = useSyncExternalStore(subscribe, isUnlocked, () => false);

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
      unlockPlayer();
      unlockDiscord();
    } catch {
      setStatus("error");
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex w-full flex-1 items-center justify-center sm:w-[360px]">
      <form
        name="player"
        method="post"
        action={FORM_ACTION}
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={onSubmit}
        className="w-full border border-line p-6"
      >
        <input type="hidden" name="form-name" value="player" />
        <p hidden>
          <label>
            Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <h2 className="font-pixel text-sm uppercase tracking-[0.2em] text-purple">Ready, player one?</h2>
        <p className="mt-3 text-sm text-muted">Drop your email to start playing.</p>
        <label className="mt-6 block">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Your email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            className="mt-2 w-full border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-purple"
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-4 w-full cursor-pointer border border-purple bg-purple px-6 py-3 font-pixel text-sm uppercase tracking-[0.2em] text-bg transition-colors hover:border-ink hover:bg-ink disabled:opacity-60"
        >
          {status === "sending" ? "Starting..." : "Play"}
        </button>
        <p aria-live="polite" className="mt-3 text-sm text-muted">
          {status === "error" ? (
            <span className="text-purple">That didn&apos;t go through. Please try again.</span>
          ) : (
            "We will not spam your inbox. Your email is stored safely on Netlify Forms."
          )}
        </p>
      </form>
    </div>
  );
}
