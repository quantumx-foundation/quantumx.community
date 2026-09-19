"use client";

import { GridCanvas } from "./grid-canvas";
import { arrowScene, bitScene, circuitScene } from "./scenes";

export function CircuitStrip() {
  return (
    <GridCanvas
      scene={circuitScene}
      rows={8}
      label="Animated quantum circuit: bits flow through gates and come out as amplitude waves"
    />
  );
}

export function ArrowField({ rows = 20 }: { rows?: number }) {
  return <GridCanvas scene={arrowScene} rows={rows} label="" className="opacity-80" />;
}

export function BitStrip() {
  return <GridCanvas scene={bitScene} rows={3} label="" />;
}
