import type { Scene } from "./grid-canvas";

/** Seeded PRNG (mulberry32) so layouts are stable across resizes. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const key = (x: number, y: number) => y * 10000 + x;
const ARROWS = ["→", "↗", "↑", "↖", "←", "↙", "↓", "↘"];
const DATA = "0101010110AFQX7+×·";

type Gate = {
  char: string;
  kind: "gate" | "ctrl" | "target" | "link" | "measure";
  partner?: number;
};

/**
 * Hero strip, read left to right: classical bits stream in, run through a
 * qubit circuit (gates, CNOTs, measurement), and come out as amplitude waves
 * whose phase is drawn as arrows.
 */
export const circuitScene: Scene = () => {
  const rand = rng(7);
  const pulses = Array.from({ length: 16 }, () => ({
    speed: 5 + rand() * 6,
    offset: rand() * 100,
  }));
  let built = -1;
  let a = 0;
  let b = 0;
  let d = 0;
  let measure = 0;
  let gates = new Map<number, Gate>();
  let data: string[] = [];
  let tone: number[] = [];

  const build = (cols: number, rows: number) => {
    built = cols;
    const wide = cols > 70;
    a = wide ? Math.round(cols * 0.13) : 0;
    d = cols - (wide ? 10 : 4);
    b = Math.round(a + (d - a) * 0.58);
    measure = b - 3;
    gates = new Map();

    for (let x = a + 4; x < measure - 1; x += 3 + Math.floor(rand() * 3)) {
      if (rand() < 0.4) {
        const c = Math.floor(rand() * rows);
        const t = (c + 1 + Math.floor(rand() * (rows - 1))) % rows;
        for (let y = Math.min(c, t) + 1; y < Math.max(c, t); y++) {
          gates.set(key(x, y), { char: "│", kind: "link" });
        }
        gates.set(key(x, c), { char: "●", kind: "ctrl", partner: t });
        gates.set(key(x, t), { char: "⊕", kind: "target" });
      } else {
        const count = 1 + Math.floor(rand() * 3);
        for (let i = 0; i < count; i++) {
          const y = Math.floor(rand() * rows);
          gates.set(key(x, y), { char: "HXZYST"[Math.floor(rand() * 6)], kind: "gate" });
        }
      }
    }
    for (let y = 0; y < rows; y++) gates.set(key(measure, y), { char: "M", kind: "measure" });

    data = Array.from({ length: Math.max(a, 1) * rows }, () => DATA[Math.floor(rand() * DATA.length)]);
    tone = data.map(() => (rand() < 0.25 ? Math.floor(rand() * 3) : -1));
  };

  return ({ cols, rows, t, colors: c, cell, fill }) => {
    if (cols !== built) build(cols, rows);
    const tones = [c.pink, c.soft, c.pale];

    // Classical data stream.
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < a - 2; x++) {
        const i = y * a + x;
        if (rand() < 0.04) data[i] = DATA[Math.floor(rand() * DATA.length)];
        if (rand() < 0.015) tone[i] = rand() < 0.3 ? Math.floor(rand() * 3) : -1;
        if (tone[i] >= 0) cell(x, y, data[i], c.ink, tones[tone[i]]);
        else cell(x, y, data[i], c.pink);
      }
    }

    // Qubit wires with a pulse travelling along each one.
    const span = b - a;
    const hot = new Set<number>();
    const trail = new Map<number, number>();
    for (let y = 0; y < rows; y++) {
      const p = pulses[y % pulses.length];
      const x = a + Math.floor((t * p.speed + p.offset) % span);
      hot.add(key(x, y));
      trail.set(key(x - 1, y), 1);
      trail.set(key(x - 2, y), 2);
      const gate = gates.get(key(x, y));
      if (gate?.kind === "ctrl" && gate.partner !== undefined) hot.add(key(x, gate.partner));
    }

    for (let y = 0; y < rows; y++) {
      for (let x = a; x < b; x++) {
        const k = key(x, y);
        const gate = gates.get(k);
        const wire = x > measure ? "═" : "─";
        const char = gate ? gate.char : wire;
        if (hot.has(k)) {
          cell(x, y, gate ? char : "◆", c.ink, gate ? c.fg : c.pink);
        } else if (trail.has(k)) {
          cell(x, y, char, c.ink, trail.get(k) === 1 ? c.soft : c.pale);
        } else if (gate?.kind === "gate" || gate?.kind === "measure") {
          cell(x, y, char, c.ink, gate.kind === "measure" ? c.soft : c.pale);
        } else if (gate) {
          cell(x, y, char, c.fg);
        } else {
          cell(x, y, char, c.dim);
        }
      }
    }

    // Amplitude waves, then their phase as arrows.
    for (let y = 0; y < rows; y++) {
      const speed = 0.8 + y * 0.07;
      for (let x = b; x < cols; x++) {
        const phase = x * (x < d ? 0.34 : 0.16) + t * speed + y * 0.9;
        if (x < d) {
          const v =
            (Math.sin(phase) * 0.5 + 0.5) * 0.65 +
            (Math.sin(phase * 0.41 + y * 1.7 - t * 0.5) * 0.5 + 0.5) * 0.35;
          fill(x, y, tones[y % 3], (Math.max(1, Math.round(v * 4)) / 4) * 0.9);
        } else {
          const arrow = ARROWS[((Math.round(phase / (Math.PI / 4)) % 8) + 8) % 8];
          if (Math.sin(phase * 3 + x) > 0.85) cell(x, y, arrow, c.ink, c.fg);
          else cell(x, y, arrow, c.pink);
        }
      }
    }
  };
};

/** Rows of arrows in alternating directions, each carrying one packet. */
export const arrowScene: Scene = () => {
  const rand = rng(3);
  const packets = Array.from({ length: 32 }, () => ({
    speed: 6 + rand() * 6,
    offset: rand() * 200,
    show: rand() < 0.6,
  }));

  return ({ cols, rows, t, colors: c, cell }) => {
    for (let y = 0; y < rows; y++) {
      const dir = y % 2 === 0 ? 1 : -1;
      const p = packets[y % packets.length];
      const pos = Math.floor((t * p.speed + p.offset) % (cols + 12)) - 6;
      const head = dir === 1 ? pos : cols - 1 - pos;
      for (let x = 0; x < cols; x++) {
        const behind = (head - x) * dir;
        if (p.show && behind === 0) cell(x, y, "◆", c.ink, y % 3 === 0 ? c.pink : c.soft);
        else if (p.show && behind > 0 && behind <= 3) cell(x, y, "·", c.dim);
        else cell(x, y, dir === 1 ? "→" : "←", c.dim);
      }
    }
  };
};

/** A strip of measured bits, shaded by a slowly drifting interference pattern. */
export const bitScene: Scene = () => {
  const rand = rng(11);
  let built = -1;
  let bits: string[] = [];

  return ({ cols, rows, t, colors: c, cell }) => {
    if (cols !== built) {
      built = cols;
      bits = Array.from({ length: cols * rows }, () => (rand() < 0.5 ? "0" : "1"));
    }
    const tones = [c.pale, c.soft, c.pink, c.fg];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (rand() < 0.03) bits[i] = bits[i] === "0" ? "1" : "0";
        const n = Math.sin((x + t * 3) * 0.23 + y * 1.3) + Math.sin((x - t * 2) * 0.11 + y * 0.7);
        const level = Math.min(4, Math.floor(((n + 2) / 4) * 5));
        if (level === 0) cell(x, y, bits[i], c.pink);
        else cell(x, y, bits[i], c.ink, tones[level - 1]);
      }
    }
  };
};
