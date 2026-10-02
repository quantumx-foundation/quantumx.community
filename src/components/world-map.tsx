import { LAND, WORLD } from "@/content/world";
import { chapters, type FlagCode } from "@/lib/site";

/** Which side of its pin a label sits on, where the default (right) would collide. */
const labelSide: Partial<Record<FlagCode, "left" | "right">> = {
  gb: "left",
  sa: "left",
  my: "left",
  au: "left",
};

/** Nudges for pins close enough that their labels would overlap. */
const labelShift: Partial<Record<FlagCode, number>> = { my: -1.2, sg: 1.2, sa: 0.6, ae: -0.6 };

function toCell(lat: number, lng: number) {
  return { x: (lng + 180) / WORLD.step, y: (WORLD.latMax - lat) / WORLD.step };
}

/** Land cells, merged into one path so the map is a single element rather than thousands. */
const landPath = LAND.flatMap((row, y) =>
  [...row].flatMap((c, x) => (c === "#" ? [`M${x + 0.2} ${y + 0.2}h0.6v0.6h-0.6z`] : [])),
).join("");

/** Dot-matrix world map with a pin per chapter: solid and pulsing when live, hollow while forming. */
export function WorldMap() {
  return (
    <figure>
      <svg
        viewBox={`0 0 ${WORLD.cols} ${WORLD.rows}`}
        role="img"
        aria-label={`World map of QuantumX chapters: live in ${chapters
          .filter((c) => c.status === "live")
          .map((c) => c.short)
          .join(" and ")}, forming in ${chapters
          .filter((c) => c.status === "forming")
          .map((c) => c.short)
          .join(", ")}.`}
        className="block h-auto w-full"
      >
        <path d={landPath} className="fill-muted/30" />
        {chapters.map((chapter) => {
          const { x, y } = toCell(chapter.pin.lat, chapter.pin.lng);
          const live = chapter.status === "live";
          const left = labelSide[chapter.code] === "left";
          return (
            <g key={chapter.code}>
              <title>{`${chapter.name}: ${live ? "live" : "forming"}`}</title>
              {live && <rect x={x - 0.6} y={y - 0.6} width={1.2} height={1.2} className="pin-pulse fill-pink" />}
              <rect
                x={x - 0.6}
                y={y - 0.6}
                width={1.2}
                height={1.2}
                strokeWidth={0.3}
                className={live ? "fill-pink" : "fill-bg stroke-pink"}
              />
              <text
                x={left ? x - 1.6 : x + 1.6}
                y={y + (labelShift[chapter.code] ?? 0)}
                textAnchor={left ? "end" : "start"}
                dominantBaseline="middle"
                fontSize={2}
                className={`hidden font-pixel uppercase sm:inline ${live ? "fill-pink" : "fill-muted"}`}
              >
                {chapter.short}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 bg-pink" /> Live
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 border border-pink" /> Forming
        </span>
      </figcaption>
    </figure>
  );
}
