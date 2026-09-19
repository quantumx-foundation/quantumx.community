import type { FlagCode } from "@/lib/site";

const W = 39;
const H = 26;

type Paint = (x: number, y: number) => string;

/** True inside an n-pointed star centred at (cx, cy). */
function inStar(x: number, y: number, cx: number, cy: number, r: number, points: number) {
  const d = Math.hypot(x - cx, y - cy);
  const a = Math.atan2(y - cy, x - cx) - Math.PI / 2;
  return d < r * (0.45 + 0.55 * Math.max(0, Math.cos(points * a)));
}

/** True inside a crescent: disc (cx, r) minus a disc shifted right by `shift`. */
function inCrescent(x: number, y: number, cx: number, cy: number, r: number, shift: number, inner: number) {
  return Math.hypot(x - cx, y - cy) < r && Math.hypot(x - cx - shift, y - cy) >= inner;
}

function unionJack(x: number, y: number, w: number, h: number) {
  const cx = Math.abs(x - w / 2);
  const cy = Math.abs(y - h / 2);
  const s = h / H;
  if (cx < 2 * s || cy < 2 * s) return "#C8102E";
  if (cx < 3.5 * s || cy < 3.5 * s) return "#FFFFFF";
  const norm = Math.hypot(w, h);
  const d1 = Math.abs(x * h - y * w) / norm;
  const d2 = Math.abs(x * h + y * w - w * h) / norm;
  if (d1 < 1 * s || d2 < 1 * s) return "#C8102E";
  if (d1 < 2.6 * s || d2 < 2.6 * s) return "#FFFFFF";
  return "#012169";
}

/** Each flag is sampled at pixel centres on a 39×26 grid. */
const paint: Record<FlagCode, Paint> = {
  in: (x, y) => {
    const r = Math.hypot(x - W / 2, y - H / 2);
    const spoke = Math.abs(Math.sin(4 * Math.atan2(y - H / 2, x - W / 2))) < 0.35;
    if (r < 1.2 || (r > 2.9 && r < 3.9) || (r < 2.9 && spoke)) return "#000080";
    if (y < H / 3) return "#FF9933";
    if (y < (2 * H) / 3) return "#FFFFFF";
    return "#138808";
  },
  ae: (x, y) => {
    if (x < 10) return "#FF0000";
    if (y < H / 3) return "#00732F";
    if (y < (2 * H) / 3) return "#FFFFFF";
    return "#000000";
  },
  gb: (x, y) => unionJack(x, y, W, H),
  sg: (x, y) => {
    if (y >= H / 2) return "#FFFFFF";
    if (inCrescent(x, y, 8, 6.5, 4.4, 1.9, 4)) return "#FFFFFF";
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      if (Math.hypot(x - (13 + 2.4 * Math.cos(a)), y - (6.5 + 2.4 * Math.sin(a))) < 0.75) return "#FFFFFF";
    }
    return "#EF3340";
  },
  my: (x, y) => {
    if (x < 20 && y < (8 * H) / 14) {
      if (inCrescent(x, y, 7.5, 7.4, 5, 1.8, 4.4)) return "#FFCC00";
      if (inStar(x, y, 14.5, 7.4, 3.4, 14)) return "#FFCC00";
      return "#010066";
    }
    return Math.floor(y / (H / 14)) % 2 === 0 ? "#CC0001" : "#FFFFFF";
  },
  au: (x, y) => {
    if (x < W / 2 && y < H / 2) return unionJack(x, y, W / 2, H / 2);
    const stars: [number, number, number][] = [
      [9.75, 19.5, 3.4],
      [30, 21.5, 2.2],
      [24.5, 11.5, 2.2],
      [30, 4, 2.2],
      [34.5, 10, 2.2],
      [32, 14, 1.4],
    ];
    for (const [cx, cy, r] of stars) if (inStar(x, y, cx, cy, r, 7)) return "#FFFFFF";
    return "#012169";
  },
  kz: (x, y) => {
    const gold = "#FEC50C";
    const r = Math.hypot(x - 22, y - 10.5);
    if (r < 4) return gold;
    if (r > 4.9 && r < 6.8 && Math.abs(Math.sin(16 * Math.atan2(y - 10.5, x - 22))) < 0.45) return gold;
    if (Math.abs(x - 22) < 8.5 && Math.abs(y - (18.6 - 0.05 * (x - 22) ** 2)) < 0.7) return gold;
    const col = Math.floor(x);
    const row = Math.floor(y);
    if (col >= 2 && col <= 4 && (col === 3 ? row % 4 !== 0 : row % 4 === 2)) return gold;
    return "#00AFCA";
  },
  sa: (x, y) => {
    const col = Math.floor(x);
    const row = Math.floor(y);
    // Abstracted script band above a sword.
    if (row >= 6 && row <= 12 && col >= 9 && col <= 29) {
      const stroke = row === 11 || (row >= 7 && (col * 7 + row * 3) % 5 === 0) || (row === 8 && col % 3 === 0);
      if (stroke) return "#FFFFFF";
    }
    if (row === 17 && col >= 9 && col <= 26) return "#FFFFFF";
    if (col === 27 && row >= 15 && row <= 19) return "#FFFFFF";
    if (row === 17 && col >= 28 && col <= 30) return "#FFFFFF";
    return "#006C35";
  },
};

const names: Record<FlagCode, string> = {
  in: "India",
  ae: "United Arab Emirates",
  gb: "United Kingdom",
  sg: "Singapore",
  my: "Malaysia",
  au: "Australia",
  kz: "Kazakhstan",
  sa: "Saudi Arabia",
};

/** A flag drawn as a dot-matrix of pixels. */
export function PixelFlag({ code, className = "" }: { code: FlagCode; className?: string }) {
  const dots = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      dots.push(
        <rect
          key={`${x}-${y}`}
          x={x + 0.08}
          y={y + 0.08}
          width={0.84}
          height={0.84}
          fill={paint[code](x + 0.5, y + 0.5)}
        />,
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Flag of ${names[code]}`}
      shapeRendering="crispEdges"
      className={className}
    >
      {dots}
    </svg>
  );
}
