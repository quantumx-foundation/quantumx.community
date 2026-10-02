"use client";

import { useRef, useState } from "react";
import { fortunes } from "@/content/fortunes";

const W = 26;
const H = 13;
const MID = W / 2;

type Px = { x: number; y: number; tone: "body" | "shade" | "crease" | "paper" };

/**
 * A folded fortune cookie as pixels: a domed ellipse with a notch at the
 * bottom where the fold tucks in, a crease down the middle, shading round the
 * edge and the tip of the fortune poking out. Built once, so the server and
 * client render the same cells.
 */
const pixels: Px[] = (() => {
  const out: Px[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = (x + 0.5 - MID) / MID;
      const dy = (y + 0.5 - H / 2) / (H / 2);
      const r = dx * dx + (dy * (dy < 0 ? 1.1 : 1)) ** 2;
      const off = Math.abs(x + 0.5 - MID);
      if (r > 1) continue;
      if (y >= 8 && off < (y - 7) * 1.5) {
        if (off < 1.5 && y <= 10) out.push({ x, y, tone: "paper" });
        continue;
      }
      const tone = off < 0.9 && y < 8 ? "crease" : dy > 0.35 || r > 0.72 ? "shade" : "body";
      out.push({ x, y, tone });
    }
  }
  return out;
})();

const tones = { body: "fill-yellow", shade: "fill-amber", crease: "fill-amber", paper: "fill-pale" };

function Cells({ cells }: { cells: Px[] }) {
  return cells.map((p) => <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} className={tones[p.tone]} />);
}

function Half({ side, open }: { side: "left" | "right"; open: boolean }) {
  const cells = pixels.filter((p) => p.tone !== "paper" && (side === "left" ? p.x < MID : p.x >= MID));
  const shift = side === "left" ? "-translate-x-[18%] -rotate-[18deg]" : "translate-x-[18%] rotate-[18deg]";
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

  function crack() {
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
          viewBox={`-6 -2 ${W + 12} ${H + 4}`}
          shapeRendering="crispEdges"
          className={`w-64 transition-transform duration-300 sm:w-80 ${
            open ? "" : "group-hover:-rotate-3 group-hover:scale-105 group-focus-visible:scale-105"
          }`}
          aria-hidden
        >
          <g className={`transition-opacity duration-200 ${open ? "opacity-0" : ""}`}>
            <Cells cells={pixels.filter((p) => p.tone === "paper")} />
          </g>
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
