"use client";

import { GridCanvas } from "./grid-canvas";
import { arrowScene, bitScene } from "./scenes";

export function ArrowField({ rows = 20 }: { rows?: number }) {
  return <GridCanvas scene={arrowScene} rows={rows} label="" className="opacity-80" />;
}

export function BitStrip() {
  return <GridCanvas scene={bitScene} rows={3} label="" />;
}
