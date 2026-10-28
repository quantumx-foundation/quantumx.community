import { ImageResponse } from "next/og";
import { MARK_PATHS, MARK_VIEWBOX } from "@/components/logo-mark";

/**
 * Share card for /game, replacing the site-wide card for this route only.
 * Rendered at build time. Colours are the community palette and the game's
 * own (see src/components/quantum-shooter.tsx); the font is next/og's
 * bundled Geist, the same family as the site's body text.
 */

export const alt = "Qubit Blaster: a tiny arcade game about qubits, from QuantumX Community";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0c0a0f";
const FG = "#f4eef6";
const MUTED = "#958c9f";
const LINE = "#2a2331";
const PURPLE = "#c46bfc";
const INK = "#2d1b55";
const MIST = "#d7e4ff";
const VIOLET = "#8b5cf6";

function Qubit({ x, y, label, superposed = false, bit = 0 }: { x: number; y: number; label: string; superposed?: boolean; bit?: 0 | 1 }) {
  const d = 64;
  return (
    <div
      style={{
        position: "absolute",
        left: x - d / 2,
        top: y - d / 2,
        width: d,
        height: d,
        borderRadius: d,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30,
        background: superposed ? "rgba(139,92,246,0.28)" : bit === 0 ? MIST : PURPLE,
        border: superposed ? `4px dashed ${VIOLET}` : "none",
        color: superposed ? MIST : INK,
      }}
    >
      {label}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BG, color: FG, padding: 64 }}>
        {/* Left: what it is */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, color: PURPLE, fontSize: 26, letterSpacing: 6 }}>
            <svg viewBox={MARK_VIEWBOX} width={44} height={34} fill={PURPLE}>
              {MARK_PATHS.map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
            QUANTUMX COMMUNITY
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, letterSpacing: -3, lineHeight: 1 }}>Qubit Blaster</div>
            <div style={{ marginTop: 28, fontSize: 34, color: MUTED, lineHeight: 1.3 }}>
              A tiny arcade game about qubits. Match 0 and 1, measure, entangle.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", border: `2px solid ${PURPLE}`, color: PURPLE, padding: "14px 24px", fontSize: 22, letterSpacing: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
              PLAY NOW →
            </div>
            <div style={{ fontSize: 24, color: MUTED, whiteSpace: "nowrap" }}>quantumx.community/game</div>
          </div>
        </div>

        {/* Right: a frame of the game */}
        <div
          style={{
            position: "relative",
            display: "flex",
            marginLeft: "auto",
            width: 440,
            height: 502,
            border: `2px solid ${LINE}`,
            backgroundImage: `linear-gradient(to right, ${LINE} 1px, transparent 1px), linear-gradient(to bottom, ${LINE} 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        >
          <div style={{ position: "absolute", left: 22, top: 18, fontSize: 22, color: FG }}>SCORE 12</div>
          <div style={{ position: "absolute", right: 22, top: 22, display: "flex", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 18, height: 18, background: PURPLE }} />
            ))}
          </div>

          <Qubit x={96} y={128} label="0" bit={0} />
          <Qubit x={320} y={200} label="1" bit={1} />
          <Qubit x={196} y={262} label="?" superposed />

          {/* Entangled pair: one link, one fate. */}
          <div style={{ position: "absolute", left: 310, top: 104, width: 76, borderTop: `4px dashed ${VIOLET}` }} />
          <Qubit x={310} y={106} label="?" superposed />
          <Qubit x={386} y={106} label="?" superposed />

          <div style={{ position: "absolute", left: 192, top: 318, width: 8, height: 28, background: PURPLE }} />
          <div style={{ position: "absolute", left: 0, top: 410, width: "100%", borderTop: `3px dashed rgba(196,107,252,0.5)` }} />
          <svg style={{ position: "absolute", left: 166, top: 414 }} width={60} height={50} viewBox="0 0 60 50">
            <path d="M30 0L60 50H0Z" fill={FG} />
            <rect x={23} y={26} width={14} height={14} fill={PURPLE} />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
