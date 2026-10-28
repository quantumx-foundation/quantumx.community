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
        if (p.show && behind === 0) cell(x, y, "◆", c.ink, y % 3 === 0 ? c.purple : c.soft);
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
    const tones = [c.pale, c.soft, c.purple, c.fg];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (rand() < 0.03) bits[i] = bits[i] === "0" ? "1" : "0";
        const n = Math.sin((x + t * 3) * 0.23 + y * 1.3) + Math.sin((x - t * 2) * 0.11 + y * 0.7);
        const level = Math.min(4, Math.floor(((n + 2) / 4) * 5));
        if (level === 0) cell(x, y, bits[i], c.purple);
        else cell(x, y, bits[i], level === 4 ? c.pale : c.ink, tones[level - 1]);
      }
    }
  };
};
