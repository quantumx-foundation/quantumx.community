import Link from "next/link";

/**
 * A still frame of Qubit Blaster for the homepage, in the game's own colours
 * (src/components/quantum-shooter.tsx): |0⟩ in mist, |1⟩ in pink, superposed
 * qubits dashed violet. Only the superposed qubit moves, flickering between
 * 0 and 1, and that stops under reduced motion. The whole frame links to /game.
 */

// The game stays dark (an arcade screen) on the light site, so the frame uses
// its fixed colours rather than the page tokens.
const GROUND = "#0c0a0f";
const INK = "#f4eef6";
const PINK = "#e485b0";
const PLUM = "#2d1b55";
const MIST = "#d7e4ff";
const VIOLET = "#8b5cf6";

function Qubit({ x, y, bit }: { x: number; y: number; bit: 0 | 1 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={17} fill={bit === 0 ? MIST : PINK} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={PLUM}>
        {bit}
      </text>
    </g>
  );
}

function Superposed({ x, y, phase = 0 }: { x: number; y: number; phase?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={17} fill="rgba(139,92,246,0.28)" stroke={VIOLET} strokeWidth={2} strokeDasharray="5 4" />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize={15}
        fontWeight={700}
        fill={MIST}
        className="qubit-flicker"
        style={{ animationDelay: `${phase}ms` }}
      >
        0
      </text>
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize={15}
        fontWeight={700}
        fill={PINK}
        className="qubit-flicker qubit-flicker-alt"
        style={{ animationDelay: `${phase}ms` }}
      >
        1
      </text>
    </g>
  );
}

export function QubitPreview() {
  return (
    <Link
      href="/game"
      aria-label="Play Qubit Blaster"
      className="group block border border-line transition-colors hover:border-pink"
    >
      <svg viewBox="0 0 360 240" className="block h-auto w-full font-mono" aria-hidden>
        <defs>
          <pattern id="qubit-grid" width={18} height={18} patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" fill="none" stroke="rgba(244,238,246,0.06)" />
          </pattern>
        </defs>
        <rect width={360} height={240} fill={GROUND} />
        <rect width={360} height={240} fill="url(#qubit-grid)" />

        <text x={14} y={22} fontSize={11} fontWeight={700} fill={INK}>
          SCORE 12
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={308 + i * 14} y={13} width={10} height={10} fill={PINK} />
        ))}

        <Qubit x={70} y={62} bit={0} />
        <Qubit x={250} y={100} bit={1} />
        <Superposed x={150} y={120} />

        <line x1={262} y1={48} x2={318} y2={48} stroke={VIOLET} strokeWidth={2} strokeDasharray="4 4" />
        <Superposed x={262} y={48} phase={120} />
        <Superposed x={318} y={48} phase={120} />

        <rect x={148} y={150} width={4} height={14} fill={PINK} />
        <line x1={0} y1={194} x2={360} y2={194} stroke="rgba(228,133,176,0.45)" strokeDasharray="6 6" />
        <path d="M150 196l16 26h-32z" fill={INK} className="transition-transform duration-300 group-hover:-translate-y-1" />
        <rect x={146} y={206} width={8} height={8} fill={PINK} />
      </svg>
    </Link>
  );
}
