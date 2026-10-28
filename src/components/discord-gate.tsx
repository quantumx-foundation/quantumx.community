"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Turnstile } from "./turnstile";
import { Button } from "./ui";
import { FORM_ACTION } from "@/lib/forms";
import { inviteFor } from "@/lib/site";

/** Set once someone has given us their email, so they only ever do it once. */
const UNLOCK_KEY = "qx-discord-unlocked";

const buttonClass =
  "inline-flex cursor-pointer items-center gap-3 border border-purple px-7 py-4 font-pixel text-sm uppercase tracking-[0.2em] text-purple transition-colors hover:bg-purple hover:text-bg focus-visible:bg-purple focus-visible:text-bg focus-visible:outline-none disabled:opacity-60";

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

const inputClass =
  "mt-2 w-full border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-purple";

type Status = "idle" | "sending" | "error";

/**
 * Name and email, posted to the "discord" Netlify form, which emails them the
 * invite (netlify/functions/on-form.mts). Used inline on /join and inside the popup.
 */
function GateForm({
  source,
  status,
  attempt,
  autoFocus,
  onSubmit,
}: {
  source: string;
  status: Status;
  /** Bumped after a failed send, so the Turnstile widget remounts with a fresh token. */
  attempt: number;
  autoFocus: boolean;
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
            autoFocus={autoFocus}
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
 * "Join the Discord", behind a name and email. A click opens a popup asking
 * for both; once they're sent to the "discord" Netlify form the popup hands
 * over the invite, and every gate on the page becomes the invite button.
 * `ask` shows the form inline instead, for /join where it is the whole page.
 * `source` tags the invite and the submission with where the visitor came from.
 */
export function DiscordGate({
  label = "Join the Discord",
  source = "site",
  ask = false,
}: {
  label?: string;
  source?: string;
  /** Show the form on the page rather than behind a click. */
  ask?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
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
      setStatus("idle");
      unlockDiscord();
    } catch {
      setStatus("error");
      setAttempt((n) => n + 1);
    }
  }

  // Only called once unlocked, which never happens on the server: it reads window.location.
  const invite = () => <Button href={inviteFor(source, currentRef())}>{label}</Button>;

  if (ask) {
    return unlocked ? invite() : <GateForm source={source} status={status} attempt={attempt} autoFocus={false} onSubmit={onSubmit} />;
  }

  return (
    <>
      {unlocked ? (
        invite()
      ) : (
        <button type="button" onClick={() => dialog.current?.showModal()} className={buttonClass}>
          {label}
          <span aria-hidden>→</span>
        </button>
      )}

      <dialog
        ref={dialog}
        aria-labelledby={`discord-gate-${source}`}
        // A click on the backdrop lands on the dialog itself, not its contents.
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md border border-line bg-panel p-0 text-fg backdrop:bg-bg/80 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 cursor-pointer px-2 py-1 font-mono text-lg text-muted transition-colors hover:text-purple"
          >
            ×
          </button>
          <p id={`discord-gate-${source}`} className="pr-8 font-pixel text-2xl text-purple">
            {unlocked ? "You're in" : "Join the Discord"}
          </p>
          {unlocked ? (
            <>
              <p className="mt-4 text-muted">
                Chapters, events, study circles and the people behind them, all in one place. A copy of the
                invite is on its way to your inbox.
              </p>
              <div className="mt-8">{invite()}</div>
            </>
          ) : (
            <>
              <p className="mt-4 mb-6 text-muted">Tell us who you are and the invite is yours.</p>
              <GateForm source={source} status={status} attempt={attempt} autoFocus onSubmit={onSubmit} />
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
