"use client";

import { useState, useSyncExternalStore } from "react";
import { unlockDiscord } from "./discord-gate";
import { FORM_ACTION } from "@/lib/forms";

/** Set once a player has given us their email, so they only ever do it once. */
const PLAYER_KEY = "qx-player-unlocked";
/** Set by the Discord gate and the other forms: they've already given us an email. */
const DISCORD_KEY = "qx-discord-unlocked";
/** Qubit Blaster's best score (quantum-shooter.tsx), shown as the arcade HI. */
const BEST_KEY = "qx-community-qubit-blaster-best";

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

const isUnlocked = () => read(PLAYER_KEY) === "yes" || read(DISCORD_KEY) === "yes";
const readBest = () => Number(read(BEST_KEY)) || 0;

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

/** The classic two-note coin chime, synthesised like the game's own sounds. */
function coinSound() {
  try {
    const ctx = new AudioContext();
    [988, 1319].forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.08;
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, t);
      amp.gain.setValueAtTime(0.05, t);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + (i ? 0.35 : 0.08));
      osc.connect(amp).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
    setTimeout(() => void ctx.close(), 800);
  } catch {
    // No WebAudio: a silent coin.
  }
}

/** The falling qubits behind the form: x and size in %, duration and delay in s. */
const FALLING: { x: number; bit: "0" | "1" | "s"; size: number; dur: number; delay: number }[] = [
  { x: 8, bit: "0", size: 9, dur: 11, delay: -2 },
  { x: 22, bit: "s", size: 7, dur: 14, delay: -9 },
  { x: 38, bit: "1", size: 6, dur: 12, delay: -5 },
  { x: 55, bit: "s", size: 10, dur: 16, delay: -12 },
  { x: 70, bit: "0", size: 7, dur: 10, delay: -7 },
  { x: 84, bit: "1", size: 9, dur: 13, delay: -1 },
  { x: 92, bit: "s", size: 6, dur: 15, delay: -4 },
  { x: 15, bit: "1", size: 6, dur: 17, delay: -14 },
  { x: 63, bit: "0", size: 6, dur: 18, delay: -16 },
];

/** A qubit in the game's colours: |0⟩ mist, |1⟩ purple, superposed dashed violet. */
function QubitDot({ bit, className = "" }: { bit: "0" | "1" | "s"; className?: string }) {
  if (bit !== "s") {
    return (
      <span className={`gate-qubit ${bit === "0" ? "gate-qubit-zero" : "gate-qubit-one"} ${className}`}>
        <span>{bit}</span>
      </span>
    );
  }
  return (
    <span className={`gate-qubit gate-qubit-sup ${className}`}>
      <span className="gate-sup-zero qubit-flicker">0</span>
      <span className="gate-sup-one qubit-flicker qubit-flicker-alt">1</span>
    </span>
  );
}

type Status = "idle" | "sending" | "collapsing" | "error";

/**
 * The attract screen in front of Qubit Blaster: an email, then the game. It
 * sits where the canvas will, at the canvas's size, so nothing jumps when the
 * game takes over. The address goes to the "player" Netlify form and is only
 * stored (netlify/functions/on-form.mts sends nothing). Anyone who already
 * gave us an email on another form goes straight to the game.
 *
 * Sending it "measures" the screen: every superposed qubit collapses to |1⟩,
 * a flash, a coin chime, and the game starts.
 */
export function GameGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("idle");
  const [valid, setValid] = useState(false);
  // The server can't see localStorage, so it always renders the gate.
  const unlocked = useSyncExternalStore(subscribe, isUnlocked, () => false);
  const best = useSyncExternalStore(subscribe, readBest, () => 0);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || status === "collapsing") return;
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("collapsing");
      coinSound();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setTimeout(
        () => {
          unlockPlayer();
          unlockDiscord();
        },
        reduced ? 150 : 1100,
      );
    } catch {
      setStatus("error");
    }
  }

  if (unlocked) return <>{children}</>;

  const collapsed = status === "collapsing";
  const busy = status === "sending" || collapsed;

  return (
    <div
      data-collapsed={collapsed || undefined}
      data-error={status === "error" || undefined}
      className="gate @container relative mx-auto aspect-[2/3] w-full max-w-[min(100%,calc((100dvh_-_8.5rem)*2/3))] overflow-hidden sm:w-[min(720px,calc(100vw_-_2rem),calc((100dvh_-_8.5rem)*2/3))] sm:max-w-none"
    >
      {/* The arcade screen: grid, falling qubits, scanlines, vignette. */}
      <div aria-hidden className="gate-grid absolute inset-0" />
      <div aria-hidden className="absolute inset-0">
        {FALLING.map((q, i) => (
          <span
            key={i}
            className="gate-fall absolute top-0"
            style={{
              left: `${q.x}%`,
              width: `${q.size}cqw`,
              animationDuration: `${q.dur}s`,
              animationDelay: `${q.delay}s`,
            }}
          >
            <QubitDot bit={q.bit} className="w-full" />
          </span>
        ))}
        {/* One entangled pair, falling together. */}
        <span
          className="gate-fall absolute top-0 flex items-center"
          style={{ left: "30%", width: "34cqw", animationDuration: "19s", animationDelay: "-6s" }}
        >
          <QubitDot bit="s" className="w-[22%] shrink-0" />
          <span className="gate-link mx-[-1px] h-0 flex-1" />
          <QubitDot bit="s" className="w-[22%] shrink-0" />
        </span>
      </div>
      <div aria-hidden className="gate-scanlines pointer-events-none absolute inset-0" />
      <div aria-hidden className="gate-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="gate-flash pointer-events-none absolute inset-0" />

      {/* Arcade HUD */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 flex justify-between p-[4cqw] font-pixel text-[max(10px,2.8cqw)] uppercase tracking-[0.2em] text-[#f4eef6]"
      >
        <span>
          <span className="text-[#c46bfc]">1UP</span> 0000
        </span>
        <span>
          HI <span className="text-[#c46bfc]">{String(best).padStart(4, "0")}</span>
        </span>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 flex justify-between p-[4cqw] font-pixel text-[max(10px,2.8cqw)] uppercase tracking-[0.2em] text-[#f4eef6]/60"
      >
        <span>1 player</span>
        <span>
          Credit <span className={collapsed ? "text-[#c46bfc]" : ""}>{collapsed ? 1 : 0}</span>
        </span>
      </div>

      {/* The form */}
      <div className="relative flex h-full flex-col items-center justify-center px-[7cqw] text-center">
        <p className="gate-blink font-pixel text-[max(10px,3cqw)] uppercase tracking-[0.3em] text-[#d7e4ff]">
          {collapsed ? "Wavefunction collapsed" : "Insert email to play"}
        </p>
        <h2 className="gate-title mt-[4cqw] font-pixel text-[clamp(1.75rem,12cqw,5.5rem)] uppercase leading-[0.9] tracking-tight text-[#f4eef6]">
          Qubit
          <br />
          <span className="text-[#c46bfc]">Blaster</span>
        </h2>
        <p className="mt-[5cqw] max-w-[34ch] text-[max(13px,3.6cqw)] leading-snug text-[#f4eef6]/70">
          Match the states, measure the superpositions, survive the entanglement.
        </p>

        <form
          name="player"
          method="post"
          action={FORM_ACTION}
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={onSubmit}
          className="gate-form mt-[8cqw] w-full max-w-[420px]"
        >
          <input type="hidden" name="form-name" value="player" />
          <p hidden>
            <label>
              Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <label htmlFor="player-email" className="sr-only">
            Your email
          </label>
          <div className="gate-field flex items-center gap-3 border px-4 py-3 transition-[border-color,box-shadow]">
            <span aria-hidden className="font-pixel text-[#c46bfc]">
              &gt;
            </span>
            <input
              id="player-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              placeholder="player@email.com"
              disabled={busy}
              onChange={(e) => {
                setValid(e.currentTarget.value !== "" && e.currentTarget.validity.valid);
                if (status === "error") setStatus("idle");
              }}
              className="min-w-0 flex-1 bg-transparent font-mono text-base text-[#f4eef6] caret-[#c46bfc] outline-none placeholder:text-[#f4eef6]/35"
            />
            {/* Superposed until the address is valid, then it collapses to |1⟩. */}
            <span
              aria-hidden
              title={valid ? "Measured: ready" : "In superposition"}
              className="w-7 shrink-0"
            >
              <QubitDot bit={valid || collapsed ? "1" : "s"} className="w-full" />
            </span>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="gate-start mt-3 flex w-full cursor-pointer items-center justify-center gap-3 bg-[#c46bfc] px-6 py-4 font-pixel text-sm uppercase tracking-[0.25em] text-[#0c0a0f] transition-[transform,background-color] hover:bg-[#f4eef6] active:translate-y-px disabled:cursor-default"
          >
            {status === "sending" ? "Measuring..." : collapsed ? "Get ready!" : "Press start"}
            {!busy && <span aria-hidden>▸</span>}
          </button>
          <p aria-live="polite" className="mt-4 min-h-[1.25em] text-[max(12px,3cqw)] text-[#f4eef6]/55">
            {status === "error" ? (
              <span className="text-[#c46bfc]">Decoherence! That didn&apos;t go through. Try again.</span>
            ) : (
              "We will not spam your inbox. Promise."
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
