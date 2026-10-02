"use client";

import { useEffect, useState } from "react";
import { gifs } from "@/content/gifs";

/**
 * Calls back `fps` times a second with a running frame count. Holds at frame 0
 * when the viewer prefers reduced motion, so each loop shows a still.
 */
function useFrame(fps: number) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setFrame((f) => f + 1), 1000 / fps);
    return () => clearInterval(id);
  }, [fps]);
  return frame;
}

/** Deterministic noise from a frame number, so the loops never need Math.random during render. */
function noise(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function Tile({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col">
      <div className="scanlines relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-line bg-panel">
        {children}
      </div>
      <figcaption className="mt-4 leading-snug text-muted">{caption}</figcaption>
    </figure>
  );
}

const CAT = [
  "..#.....#..",
  "..##...##..",
  "..#######..",
  ".##.###.##.",
  ".#########.",
  ".####.####.",
  "..#######..",
];

const BOX = [
  "#.............#",
  ".##.........##.",
  "..###########..",
  "..#.........#..",
  "..#.........#..",
  "..#.........#..",
  "..###########..",
];

function Bitmap({ rows, x, y, className }: { rows: string[]; x: number; y: number; className: string }) {
  return (
    <g className={className}>
      {rows.flatMap((row, j) =>
        [...row].map((c, i) => (c === "#" ? <rect key={`${i}-${j}`} x={x + i} y={y + j} width={1.02} height={1.02} /> : null)),
      )}
    </g>
  );
}

/** Schrödinger's cat flickers in and out of the box until you look at it. */
function CatLoop() {
  const frame = useFrame(8);
  const [observed, setObserved] = useState(false);
  const here = observed || noise(frame) > 0.5;
  return (
    <Tile caption="Schrödinger's cat, waiting to see if you'll join the Discord. Hover to observe.">
      <svg
        viewBox="0 0 15 16"
        className="h-3/5"
        role="img"
        aria-label="A pixel cat flickering in and out of a box"
        onPointerEnter={() => setObserved(true)}
        onPointerLeave={() => setObserved(false)}
      >
        <Bitmap rows={CAT} x={2} y={2} className={`fill-pink transition-opacity duration-100 ${here ? "" : "opacity-15"}`} />
        <Bitmap rows={BOX} x={0} y={8} className="fill-muted" />
      </svg>
      <span className="absolute bottom-3 left-4 font-mono text-xs text-muted">
        {observed ? "|alive⟩" : "(|alive⟩ + |nope⟩)/√2"}
      </span>
    </Tile>
  );
}

/** A hardware job queue that only ever gets longer. */
function QueueLoop() {
  const frame = useFrame(4);
  // Creeps forward, then someone with priority access jumps in.
  const cycle = frame % 40;
  const position = 4812 - cycle * 7 + (cycle > 30 ? 1203 : 0);
  return (
    <Tile caption="Submitting your first job to real quantum hardware.">
      <div className="w-full px-6 font-mono text-sm leading-relaxed sm:px-8">
        <p className="text-muted">&gt; job.submit()</p>
        <p className="mt-2 text-fg">
          status: <span className="text-pink">QUEUED</span>
        </p>
        <p className="text-fg">
          position: <span className="tabular-nums">{position.toLocaleString("en-US")}</span>
          {cycle > 30 && <span className="text-pink"> ↑</span>}
        </p>
        <p className="text-muted">
          eta: {cycle > 30 ? "lol" : "soon"}
          <span className={frame % 2 ? "opacity-0" : ""}>_</span>
        </p>
      </div>
    </Tile>
  );
}

const WORD = "SUPERPOSITION";
const GLYPHS = "░▒▓01?#%";

/** A word decohering into noise, a letter at a time, then snapping back. */
function DecoherenceLoop() {
  const frame = useFrame(10);
  const cycle = frame % 60;
  const lost = Math.max(0, Math.min(WORD.length, Math.floor((cycle - 8) / 3)));
  return (
    <Tile caption="My focus, twenty minutes into the linear algebra.">
      <p aria-label={WORD} className="px-4 text-center font-pixel text-2xl tracking-widest sm:text-3xl">
        {[...WORD].map((c, i) => {
          const gone = noise(i * 7 + 1) * WORD.length < lost;
          return (
            <span key={i} aria-hidden className={gone ? "text-dim" : "text-fg"}>
              {gone ? GLYPHS[Math.floor(noise(frame + i) * GLYPHS.length)] : c}
            </span>
          );
        })}
      </p>
      <span className="absolute bottom-3 left-4 font-mono text-xs text-muted">
        coherence {Math.round(100 - (lost / WORD.length) * 100)}%
      </span>
    </Tile>
  );
}

/** Three short pixel loops, plus any GIFs added to src/content/gifs.ts. */
export function QuantumLoops() {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      <CatLoop />
      <QueueLoop />
      <DecoherenceLoop />
      {gifs.map((gif) => (
        <Tile key={gif.src} caption={gif.caption}>
          {/* GIFs animate only as plain images; the image optimiser would freeze them. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gif.src} alt={gif.alt} className="h-full w-full object-cover" />
        </Tile>
      ))}
    </div>
  );
}
