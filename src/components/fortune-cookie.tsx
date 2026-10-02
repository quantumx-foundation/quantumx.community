"use client";

import { useRef, useState } from "react";
import { fortunes } from "@/content/fortunes";

const W = 30;
const H = 24;
const MID = W / 2;

type Tone = "outline" | "rim" | "top" | "light" | "chip" | "face" | "shine" | "blush";
type Px = { x: number; y: number; tone: Tone };

/** Baked-cookie browns, plus the site's pink for the cheeks. */
const fills: Record<Tone, string> = {
  outline: "#8a5530",
  rim: "#d08f55",
  top: "#e8ad74",
  light: "#f5cf9f",
  chip: "#6b3f22",
  face: "#3a2316",
  shine: "#fff8f0",
  blush: "var(--pink)",
};

const ellipse = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) =>
  ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;

/** Slightly lumpy, like it came off a real tray. */
function inside(x: number, y: number) {
  const X = x + 0.5;
  const Y = y + 0.5;
  const bump = 1 + 0.035 * Math.sin(Math.atan2(Y - 12, X - MID) * 7);
  return ellipse(X, Y, MID, 12, 14.3 * bump, 11.6 * bump) <= 1;
}

const chips = [
  [6, 9],
  [21, 5],
  [24, 10],
  [9, 17],
  [21, 16],
  [15, 19],
  [12, 4],
];
const eyes = [
  [10, 10],
  [18, 10],
];

/**
 * A kawaii chocolate chip cookie as pixels: a baked rim, a lighter top with a
 * highlight, chips, and a face. Built once, so the server and client render
 * the same cells.
 */
const pixels: Px[] = (() => {
  const out: Px[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!inside(x, y)) continue;
      const X = x + 0.5;
      const Y = y + 0.5;
      let tone: Tone = ellipse(X, Y, MID, 10.6, 12.6, 9.6) > 1 ? "rim" : "top";
      if (tone === "top" && ellipse(X, Y, 8.5, 5.5, 3.6, 1.8) <= 1) tone = "light";
      if (chips.some(([cx, cy]) => x - cx >= 0 && x - cx <= 1 && y - cy >= 0 && y - cy <= 1)) tone = "chip";
      for (const [ex, ey] of eyes) {
        if (x - ex >= 0 && x - ex <= 1 && y - ey >= 0 && y - ey <= 1) tone = x === ex && y === ey ? "shine" : "face";
      }
      if ((y === 13 && (x === 13 || x === 16)) || (y === 14 && (x === 14 || x === 15))) tone = "face";
      if (y === 12 && [7, 8, 21, 22].includes(x)) tone = "blush";
      if (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)) tone = "outline";
      out.push({ x, y, tone });
    }
  }
  return out;
})();

/** Where the cookie snaps: a zigzag down the middle, so it breaks rather than slices. */
const crack = (y: number) => MID + [0, 1, 1, 0, -1, -1][y % 6];

function Cells({ cells }: { cells: Px[] }) {
  return cells.map((p) => <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} fill={fills[p.tone]} />);
}

function Half({ side, open }: { side: "left" | "right"; open: boolean }) {
  const cells = pixels.filter((p) => (side === "left" ? p.x < crack(p.y) : p.x >= crack(p.y)));
  const shift = side === "left" ? "-translate-x-[14%] -rotate-[14deg]" : "translate-x-[14%] rotate-[14deg]";
  return (
    <g
      className={`transition-transform duration-500 ease-out [transform-box:fill-box] ${
        side === "left" ? "origin-bottom-right" : "origin-bottom-left"
      } ${open ? shift : ""}`}
    >
      <Cells cells={cells} />
    </g>
  );
}

function luckyNumbers() {
  const picks = new Set<number>();
  while (picks.size < 6) picks.add(1 + Math.floor(Math.random() * 64));
  return [...picks].sort((a, b) => a - b);
}

export function FortuneCookie() {
  const [open, setOpen] = useState(false);
  const [fortune, setFortune] = useState<{ text: string; numbers: number[] } | null>(null);
  const last = useRef(-1);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sound = useRef<HTMLAudioElement>(null);

  function crack() {
    // Loaded on the first crack rather than with the page, and only ever after a click.
    sound.current ??= new Audio("/sounds/egg-crack.mp3");
    sound.current.currentTime = 0;
    sound.current.play().catch(() => {});
    let i = Math.floor(Math.random() * fortunes.length);
    if (i === last.current) i = (i + 1) % fortunes.length;
    last.current = i;
    setFortune({ text: fortunes[i], numbers: luckyNumbers() });
    setOpen(true);
  }

  function onClick() {
    clearTimeout(timer.current);
    if (!open) return crack();
    // Close it up first, so every fortune gets its own crack.
    setOpen(false);
    timer.current = setTimeout(crack, 450);
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onClick}
        aria-label={open ? "Crack another fortune cookie" : "Crack open the fortune cookie"}
        className="group cursor-pointer p-4 outline-none"
      >
        <svg
          viewBox={`-8 -2 ${W + 16} ${H + 4}`}
          shapeRendering="crispEdges"
          className={`w-64 transition-transform duration-300 sm:w-80 ${
            open ? "" : "group-hover:-rotate-3 group-hover:scale-105 group-focus-visible:scale-105"
          }`}
          aria-hidden
        >
          <Half side="left" open={open} />
          <Half side="right" open={open} />
        </svg>
      </button>

      <div className="mt-2 min-h-36 w-full max-w-md" aria-live="polite">
        {open && fortune ? (
          <div className="fortune-slip bg-pale px-6 py-5 text-center text-ink">
            <p className="text-lg leading-snug">{fortune.text}</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider opacity-70">
              Lucky numbers {fortune.numbers.join(" · ")}
            </p>
          </div>
        ) : (
          <p className="pt-4 text-center font-pixel text-sm uppercase tracking-[0.2em] text-yellow">
            Tap to crack it open
          </p>
        )}
      </div>
    </div>
  );
}
