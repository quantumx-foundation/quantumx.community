import { ImageResponse } from "next/og";
import { MARK_PATHS, MARK_VIEWBOX } from "@/components/logo-mark";
import { chapters, liveChapters, listNames } from "@/lib/site";

export const alt = "QuantumX Community: a global quantum community";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0c0a0f",
          color: "#f4eef6",
        }}
      >
        <svg viewBox={MARK_VIEWBOX} width={160} height={125} fill="#e485b0">
          {MARK_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", fontSize: 88, color: "#2d1b55", background: "#e485b0", padding: "0 16px", letterSpacing: 4 }}>
            QUANTUMX
          </div>
          <div style={{ display: "flex", fontSize: 88, color: "#2d1b55", background: "#f0b3cf", padding: "0 16px", letterSpacing: 4 }}>
            COMMUNITY
          </div>
          <div style={{ display: "flex", marginTop: 36, fontSize: 34, color: "#958c9f" }}>
            {`Live in ${listNames(liveChapters)} · ${chapters.length} countries and growing`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
