"use client";

import { useEffect, useRef } from "react";

export type Colors = {
  fg: string;
  muted: string;
  line: string;
  dim: string;
  pink: string;
  soft: string;
  pale: string;
  ink: string;
};

export type Frame = {
  cols: number;
  rows: number;
  /** Seconds since mount. Frozen when the viewer prefers reduced motion. */
  t: number;
  colors: Colors;
  /** Draw one character cell, optionally on a filled background. */
  cell: (x: number, y: number, char: string, fg: string, bg?: string) => void;
  /** Fill a cell from its bottom edge up to `height` (0–1). */
  fill: (x: number, y: number, color: string, height?: number) => void;
};

/** A scene factory: called once per mount, returns the per-frame draw function. */
export type Scene = () => (frame: Frame) => void;

type Props = {
  scene: Scene;
  rows: number;
  label: string;
  fps?: number;
  className?: string;
};

/**
 * A character grid drawn on canvas. Cell height comes from the `--cell` CSS
 * variable so the layout reserves the right height before JS runs.
 */
export function GridCanvas({ scene, rows, label, fps = 12, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = getComputedStyle(document.documentElement);
    const token = (name: string) => root.getPropertyValue(`--${name}`).trim();
    const colors: Colors = {
      fg: token("fg"),
      muted: token("muted"),
      line: token("line"),
      dim: token("dim"),
      pink: token("pink"),
      soft: token("soft"),
      pale: token("pale"),
      ink: token("ink"),
    };

    const draw = scene();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let cols = 0;
    let cw = 0;
    let ch = 0;
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let alive = true;

    const cell: Frame["cell"] = (x, y, char, fg, bg) => {
      const px = x * cw;
      const py = y * ch;
      if (bg) {
        ctx.fillStyle = bg;
        ctx.fillRect(px, py, cw + 0.5, ch + 0.5);
      }
      if (char !== " ") {
        ctx.fillStyle = fg;
        ctx.fillText(char, px + cw / 2, py + ch / 2 + 1);
      }
    };

    const fill: Frame["fill"] = (x, y, color, h = 1) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * cw, y * ch + ch * (1 - h), cw + 0.5, ch * h);
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      draw({ cols, rows, t: reduced ? 6 : (now - start) / 1000, colors, cell, fill });
    };

    const resize = () => {
      if (!alive) return;
      const style = getComputedStyle(canvas);
      ch = parseFloat(style.getPropertyValue("--cell")) || 24;
      cw = ch * 0.6;
      width = canvas.clientWidth;
      height = rows * ch;
      cols = Math.ceil(width / cw);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${Math.round(ch * 0.72)}px ${style.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      render(performance.now());
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 1000 / fps) return;
      last = now;
      render(now);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);
    document.fonts.ready.then(resize);
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [scene, rows, fps]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className={`block w-full font-pixel [--cell:18px] sm:[--cell:26px] ${className}`}
      style={{ height: `calc(var(--cell) * ${rows})` }}
    />
  );
}
