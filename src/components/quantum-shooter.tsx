"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Qubit Blaster, served at /game. Ported from the QFF26 site (qff2026 repo,
 * components/game/QuantumShooter.tsx), where it sits in a dialog on /live;
 * only the palette, font and control styling differ, so fixes to the game
 * logic belong in both.
 *
 * A small arcade shooter that teaches three ideas, one at a
 * time, as they first appear on screen.
 *
 * 1. A measured qubit is 0 or 1: fire the matching state to clear it.
 * 2. Superposition: a flickering qubit is both. Shooting it measures it, and
 *    it collapses to a plain 0 or 1 at random, which you then clear.
 * 3. Entanglement: two linked qubits. Measure one and the other collapses to
 *    the same value (a Bell pair, kept to its simplest reading).
 *
 * Everything runs in one canvas loop held in an effect; React state carries
 * only what the buttons under the canvas show. Sound is synthesised with
 * WebAudio, so there are no audio files, and the context is only created
 * after a tap or key press, as browsers require.
 */

type Bit = 0 | 1;
type Phase = "intro" | "play" | "over";

type Qubit = {
  id: number;
  x: number;
  y: number;
  vy: number;
  /** null while in superposition. */
  state: Bit | null;
  partner: number | null;
  flash: number;
};
type Bullet = { x: number; y: number; mode: Bit };
type Float = { x: number; y: number; text: string; color: string; life: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const W = 360;
const H = 540;
const R = 17;
const SHIP_Y = H - 48;
const FLOOR = H - 76;
const TAU = Math.PI * 2;
const BEST_KEY = "qx-community-qubit-blaster-best";

// The original dark community palette, kept fixed so the game reads as an
// arcade screen on the light site: near-black ground, brand purple for |1⟩
// and ink on the qubits. |0⟩ keeps the QFF mist blue so the two states stay
// distinguishable at a glance.
const C = {
  ground: "#0c0a0f",
  ink: "#f4eef6",
  dim: "rgba(244,238,246,0.6)",
  grid: "rgba(244,238,246,0.05)",
  zero: "#d7e4ff",
  one: "#c46bfc",
  violet: "#8b5cf6",
  plum: "#2d1b55",
};
const stateColor = (b: Bit) => (b === 0 ? C.zero : C.one);

const TIPS = {
  start: "Each qubit is |0⟩ or |1⟩. Fire the matching state to clear it. Switch with X.",
  superposition:
    "Superposition! This qubit is 0 and 1 at once. Shoot it to measure it, and it collapses to one.",
  entangled:
    "Entanglement! These two are linked. Measure one and the other collapses to the same value.",
  wrong: "Wrong state. Switch your blaster to match the qubit.",
};

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    /* private window: best score just isn't kept */
  }
}

/* --- sound --------------------------------------------------------------- */

function createSound() {
  let ctx: AudioContext | null = null;
  let muted = false;

  function tone(
    freq: number,
    dur: number,
    { type = "square", to, gain = 0.06, delay = 0 }: {
      type?: OscillatorType;
      to?: number;
      gain?: number;
      delay?: number;
    } = {},
  ) {
    if (muted || !ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  return {
    /** Called from every tap and key press: iOS only lets audio start inside
     *  some gestures (touchend, not always touchstart), so it is retried. */
    unlock() {
      try {
        ctx ??= new AudioContext();
        if (ctx.state === "suspended") void ctx.resume();
      } catch {
        /* no WebAudio: the game simply runs silent */
      }
    },
    setMuted(value: boolean) {
      muted = value;
    },
    close() {
      void ctx?.close();
    },
    shoot: () => tone(900, 0.07, { to: 450, gain: 0.03 }),
    toggle: () => tone(600, 0.05, { type: "triangle", gain: 0.05 }),
    hit() {
      tone(523, 0.08, { type: "triangle", gain: 0.08 });
      tone(784, 0.12, { type: "triangle", gain: 0.08, delay: 0.07 });
    },
    measure: () => tone(260, 0.28, { type: "sine", to: 1300, gain: 0.08 }),
    wrong: () => tone(140, 0.15, { type: "sawtooth", gain: 0.04 }),
    lose: () => tone(220, 0.4, { to: 60, gain: 0.06 }),
    start: () =>
      [262, 330, 392, 523].forEach((f, i) =>
        tone(f, 0.12, { type: "triangle", gain: 0.06, delay: i * 0.08 }),
      ),
    over: () =>
      [392, 330, 262, 196].forEach((f, i) =>
        tone(f, 0.22, { type: "triangle", gain: 0.07, delay: i * 0.18 }),
      ),
  };
}

/* --- component ----------------------------------------------------------- */

export function QuantumShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ toggle(): void; setMuted(m: boolean): void } | null>(null);
  const [mode, setMode] = useState<Bit>(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.focus();

    // The game is laid out in a fixed W×H space; the backing store follows the
    // size the canvas is actually shown at, so it stays sharp however large
    // the layout lets it grow. `scale` maps game units to device pixels.
    let scale = 1;
    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const shown = canvas!.getBoundingClientRect().width || W;
      scale = (shown / W) * dpr;
      canvas!.width = Math.round(W * scale);
      canvas!.height = Math.round(H * scale);
    }
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(canvas);

    const font =
      getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() ||
      "monospace";
    const sound = createSound();

    let phase: Phase = "intro";
    let qubits: Qubit[] = [];
    let bullets: Bullet[] = [];
    let floats: Float[] = [];
    let sparks: Spark[] = [];
    let shipX = W / 2;
    let targetX: number | null = null;
    let shipMode: Bit = 0;
    let score = 0;
    let lives = 3;
    let best = readBest();
    let spawnIn = 0;
    let cooldown = 0;
    let clock = 0;
    let nextId = 1;
    let firing = false;
    let firePointer: number | null = null;
    /** Clock time of the last game over, so a tap still firing can't restart. */
    let overAt = -Infinity;
    const canRestart = () => phase === "intro" || clock - overAt > 0.8;
    let tip: { text: string; life: number } | null = null;
    const seen = new Set<keyof typeof TIPS>();
    const held = new Set<string>();

    function showTip(key: keyof typeof TIPS) {
      if (seen.has(key)) return;
      seen.add(key);
      tip = { text: TIPS[key], life: 5 };
    }

    function start() {
      sound.unlock();
      sound.start();
      phase = "play";
      qubits = [];
      bullets = [];
      floats = [];
      sparks = [];
      score = 0;
      lives = 3;
      spawnIn = 0.6;
      cooldown = 0;
      shipMode = 0;
      setMode(0);
      seen.clear();
      showTip("start");
    }

    function toggle() {
      shipMode = shipMode === 0 ? 1 : 0;
      setMode(shipMode);
      sound.toggle();
    }

    function fire() {
      if (phase !== "play" || cooldown > 0) return;
      bullets.push({ x: shipX, y: SHIP_Y - 18, mode: shipMode });
      cooldown = 0.22;
      sound.shoot();
    }

    function burst(x: number, y: number, color: string, n = 12) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * TAU;
        const s = 40 + Math.random() * 120;
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5, color });
      }
    }

    function float(x: number, y: number, text: string, color = C.ink) {
      floats.push({ x, y, text, color, life: 1 });
    }

    function spawn() {
      const level = Math.min(score / 30, 1);
      const vy = 32 + level * 42 + Math.random() * 10;
      const x = 30 + Math.random() * (W - 60);

      if (score >= 10 && Math.random() < 0.22) {
        const x2 = x < W / 2 ? Math.min(x + 110, W - 30) : Math.max(x - 110, 30);
        const a = nextId++;
        const b = nextId++;
        qubits.push(
          { id: a, x, y: -R, vy, state: null, partner: b, flash: 0 },
          { id: b, x: x2, y: -R, vy, state: null, partner: a, flash: 0 },
        );
        showTip("entangled");
        return;
      }

      const superChance = score >= 3 ? 0.3 + level * 0.2 : 0;
      const isSuper = Math.random() < superChance;
      if (isSuper) showTip("superposition");
      qubits.push({
        id: nextId++,
        x,
        y: -R,
        vy,
        state: isSuper ? null : Math.random() < 0.5 ? 0 : 1,
        partner: null,
        flash: 0,
      });
    }

    function measure(q: Qubit) {
      const value: Bit = Math.random() < 0.5 ? 0 : 1;
      q.state = value;
      q.flash = 0.4;
      float(q.x, q.y - 26, `measured |${value}⟩`, stateColor(value));
      sound.measure();

      const p = qubits.find((o) => o.id === q.partner);
      if (p && p.state === null) {
        p.state = value;
        p.flash = 0.4;
        float(p.x, p.y - 26, `entangled |${value}⟩`, C.violet);
      }
      if (p) p.partner = null;
      q.partner = null;
    }

    function unlink(q: Qubit) {
      const p = qubits.find((o) => o.id === q.partner);
      if (p) p.partner = null;
    }

    function gameOver() {
      phase = "over";
      firing = false;
      overAt = clock;
      if (score > best) {
        best = score;
        writeBest(best);
      }
      sound.over();
    }

    /* --- update ---------------------------------------------------------- */

    function update(dt: number) {
      clock += dt;

      for (const s of sparks) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt;
      }
      sparks = sparks.filter((s) => s.life > 0);
      for (const f of floats) {
        f.y -= 24 * dt;
        f.life -= dt;
      }
      floats = floats.filter((f) => f.life > 0);
      if (tip && (tip.life -= dt) <= 0) tip = null;

      if (phase !== "play") return;

      cooldown -= dt;
      const dir =
        (held.has("ArrowRight") || held.has("d") ? 1 : 0) -
        (held.has("ArrowLeft") || held.has("a") ? 1 : 0);
      if (dir) {
        targetX = null;
        shipX += dir * 260 * dt;
      } else if (targetX !== null) {
        const step = 480 * dt;
        shipX += Math.max(-step, Math.min(step, targetX - shipX));
      }
      shipX = Math.max(20, Math.min(W - 20, shipX));
      if (firing) fire();

      if ((spawnIn -= dt) <= 0) {
        spawn();
        spawnIn = Math.max(0.6, 1.6 - score * 0.03);
      }

      for (const b of bullets) b.y -= 460 * dt;
      for (const q of qubits) {
        q.y += q.vy * dt;
        q.flash = Math.max(0, q.flash - dt);
      }

      const spentBullets = new Set<Bullet>();
      const cleared = new Set<Qubit>();
      for (const b of bullets) {
        for (const q of qubits) {
          if (cleared.has(q) || Math.hypot(b.x - q.x, b.y - q.y) > R + 4) continue;
          spentBullets.add(b);
          if (q.state === null) {
            measure(q);
          } else if (q.state === b.mode) {
            cleared.add(q);
            score += 1;
            burst(q.x, q.y, stateColor(q.state));
            float(q.x, q.y, "+1");
            sound.hit();
          } else {
            float(q.x, q.y - 26, "wrong state", C.dim);
            sound.wrong();
            showTip("wrong");
          }
          break;
        }
      }

      for (const q of qubits) {
        if (cleared.has(q) || q.y < FLOOR) continue;
        cleared.add(q);
        unlink(q);
        lives -= 1;
        burst(q.x, FLOOR, C.one, 18);
        sound.lose();
      }
      for (const q of cleared) unlink(q);

      bullets = bullets.filter((b) => !spentBullets.has(b) && b.y > -10);
      qubits = qubits.filter((q) => !cleared.has(q));
      if (lives <= 0) gameOver();
    }

    /* --- draw ------------------------------------------------------------ */

    function text(
      s: string,
      x: number,
      y: number,
      { size = 12, weight = 600, color = C.ink, align = "center" as CanvasTextAlign } = {},
    ) {
      ctx!.font = `${weight} ${size}px ${font}`;
      ctx!.fillStyle = color;
      ctx!.textAlign = align;
      ctx!.textBaseline = "middle";
      ctx!.fillText(s, x, y);
    }

    function wrap(s: string, x: number, y: number, maxW: number, lh: number, size = 12, color = C.ink) {
      ctx!.font = `600 ${size}px ${font}`;
      const lines: string[] = [];
      let line = "";
      for (const word of s.split(" ")) {
        const next = line ? `${line} ${word}` : word;
        if (ctx!.measureText(next).width > maxW && line) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      lines.push(line);
      lines.forEach((l, i) => text(l, x, y + i * lh, { size, color }));
      return lines.length;
    }

    function drawQubit(x: number, y: number, state: Bit | null, seed: number, flash = 0) {
      const c = ctx!;
      if (state === null) {
        const shown: Bit = Math.floor(clock * 8 + seed) % 2 === 0 ? 0 : 1;
        c.fillStyle = "rgba(139,92,246,0.28)";
        c.beginPath();
        c.arc(x, y, R, 0, TAU);
        c.fill();
        c.strokeStyle = C.violet;
        c.lineWidth = 2;
        c.setLineDash([5, 4]);
        c.lineDashOffset = -clock * 24;
        c.stroke();
        c.setLineDash([]);
        text(String(shown), x, y + 1, { size: 15, weight: 700, color: stateColor(shown) });
      } else {
        c.fillStyle = stateColor(state);
        c.beginPath();
        c.arc(x, y, R, 0, TAU);
        c.fill();
        text(String(state), x, y + 1, { size: 15, weight: 700, color: C.plum });
      }
      if (flash > 0) {
        c.strokeStyle = `rgba(255,255,255,${flash / 0.4})`;
        c.lineWidth = 2;
        c.beginPath();
        c.arc(x, y, R + (0.4 - flash) * 50, 0, TAU);
        c.stroke();
      }
    }

    function draw() {
      const c = ctx!;
      c.setTransform(scale, 0, 0, scale, 0, 0);
      c.fillStyle = C.ground;
      c.fillRect(0, 0, W, H);

      c.strokeStyle = C.grid;
      c.lineWidth = 1;
      c.beginPath();
      for (let x = 0.5; x < W; x += 18) {
        c.moveTo(x, 0);
        c.lineTo(x, H);
      }
      for (let y = 0.5; y < H; y += 18) {
        c.moveTo(0, y);
        c.lineTo(W, y);
      }
      c.stroke();

      if (phase === "intro") {
        text("QUBIT BLASTER", W / 2, 70, { size: 24, weight: 700 });
        text("A tiny game about qubits", W / 2, 100, { color: C.dim });

        drawQubit(70, 170, 0, 0);
        drawQubit(70, 220, 1, 0);
        text("Qubits are 0 or 1.", 100, 170, { align: "left" });
        text("Match your blaster to clear.", 100, 220, { align: "left" });
        drawQubit(70, 280, null, 0);
        text("Superposition: both.", 100, 272, { align: "left" });
        text("Shoot it to measure.", 100, 290, { align: "left", color: C.dim });

        c.strokeStyle = C.violet;
        c.setLineDash([4, 4]);
        c.beginPath();
        c.moveTo(48, 345);
        c.lineTo(92, 345);
        c.stroke();
        c.setLineDash([]);
        // Same seed: an entangled pair always shows the same value.
        drawQubit(48, 345, null, 1);
        drawQubit(92, 345, null, 1);
        text("Entangled: measure", 120, 337, { align: "left" });
        text("one, both match.", 120, 355, { align: "left", color: C.dim });

        text("Move: mouse, drag or ← →", W / 2, 410, { color: C.dim });
        text("Fire: click, tap or Space   Switch: X", W / 2, 430, { color: C.dim });
        if (Math.floor(clock * 2) % 2 === 0) {
          text("TAP OR PRESS SPACE TO START", W / 2, 480, { size: 13, weight: 700, color: C.one });
        }
        return;
      }

      // Danger line.
      c.strokeStyle = "rgba(196,107,252,0.45)";
      c.setLineDash([6, 6]);
      c.beginPath();
      c.moveTo(0, FLOOR + R);
      c.lineTo(W, FLOOR + R);
      c.stroke();
      c.setLineDash([]);

      // Entanglement links.
      c.strokeStyle = C.violet;
      c.lineWidth = 2;
      c.setLineDash([4, 4]);
      c.lineDashOffset = -clock * 20;
      for (const q of qubits) {
        const p = qubits.find((o) => o.id === q.partner);
        if (!p || q.id > p.id) continue;
        c.beginPath();
        c.moveTo(q.x, q.y);
        c.lineTo(p.x, p.y);
        c.stroke();
      }
      c.setLineDash([]);

      // An entangled pair shares one flicker seed, so the two always show the
      // same value, which is the whole point of entanglement.
      for (const q of qubits) {
        const seed = q.partner === null ? q.id : Math.min(q.id, q.partner);
        drawQubit(q.x, q.y, q.state, seed, q.flash);
      }

      for (const b of bullets) {
        c.fillStyle = stateColor(b.mode);
        c.fillRect(b.x - 2, b.y - 7, 4, 14);
      }

      for (const s of sparks) {
        c.globalAlpha = s.life / 0.5;
        c.fillStyle = s.color;
        c.fillRect(s.x - 1.5, s.y - 1.5, 3, 3);
      }
      c.globalAlpha = 1;

      // Ship.
      if (phase === "play") {
        c.fillStyle = C.ink;
        c.beginPath();
        c.moveTo(shipX, SHIP_Y - 16);
        c.lineTo(shipX + 16, SHIP_Y + 10);
        c.lineTo(shipX - 16, SHIP_Y + 10);
        c.closePath();
        c.fill();
        c.fillStyle = stateColor(shipMode);
        c.fillRect(shipX - 4, SHIP_Y - 4, 8, 8);
        text(`|${shipMode}⟩`, shipX, SHIP_Y + 26, { size: 13, weight: 700, color: stateColor(shipMode) });
      }

      for (const f of floats) {
        c.globalAlpha = Math.max(0, f.life);
        text(f.text, f.x, f.y, { size: 11, weight: 700, color: f.color });
      }
      c.globalAlpha = 1;

      // HUD.
      text(`SCORE ${score}`, 12, 18, { align: "left", weight: 700 });
      text("LIVES", W - 60, 18, { align: "right", color: C.dim });
      for (let i = 0; i < 3; i++) {
        c.fillStyle = i < lives ? C.one : "rgba(255,255,255,0.15)";
        c.fillRect(W - 52 + i * 14, 12, 10, 10);
      }

      if (tip) {
        c.globalAlpha = Math.min(1, tip.life * 2);
        c.fillStyle = "rgba(0,0,0,0.45)";
        c.fillRect(10, 36, W - 20, 54);
        wrap(tip.text, W / 2, 52, W - 44, 16, 11);
        c.globalAlpha = 1;
      }

      if (phase === "over") {
        c.fillStyle = "rgba(12,10,15,0.9)";
        c.fillRect(0, 0, W, H);
        text("GAME OVER", W / 2, 150, { size: 26, weight: 700 });
        text("Your qubits decohered", W / 2, 182, { color: C.dim });
        text(`SCORE ${score}`, W / 2, 240, { size: 18, weight: 700, color: C.one });
        text(`BEST ${best}`, W / 2, 268, { color: C.dim });
        wrap(
          "Takeaway: measuring a qubit collapses its superposition to a plain 0 or 1. Entangled qubits collapse together.",
          W / 2,
          320,
          W - 70,
          18,
          12,
        );
        if (Math.floor(clock * 2) % 2 === 0) {
          text("TAP OR PRESS SPACE TO PLAY AGAIN", W / 2, 440, { size: 12, weight: 700, color: C.one });
        }
      }
    }

    /* --- input & loop ---------------------------------------------------- */

    const toLocalX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * W;
    };

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      sound.unlock();
      if (phase !== "play") {
        if (canRestart()) start();
        return;
      }
      targetX = toLocalX(e.clientX);
      firePointer = e.pointerId;
      firing = true;
      fire();
    }
    // Only the finger that started firing stops it, so a second finger tapping
    // Switch doesn't interrupt a held shot.
    function onPointerUp(e: PointerEvent) {
      sound.unlock();
      if (e.pointerId !== firePointer) return;
      firePointer = null;
      firing = false;
    }
    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === "mouse" || e.pointerId === firePointer) {
        targetX = toLocalX(e.clientX);
      }
    }
    // Losing the window (alt-tab, a call, the app switcher) never delivers the
    // matching key or pointer up, so drop everything that was held.
    function release() {
      held.clear();
      firing = false;
      firePointer = null;
    }

    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      // Space on a focused button (Close, Sound) should press that button.
      if (key === " " && e.target instanceof HTMLButtonElement) return;
      if (["ArrowLeft", "ArrowRight", "a", "d"].includes(key)) {
        held.add(key);
        e.preventDefault();
      } else if (key === " ") {
        e.preventDefault();
        sound.unlock();
        if (phase !== "play") {
          if (!e.repeat && canRestart()) start();
        } else {
          firing = true;
          fire();
        }
      } else if (key === "x" || key === "ArrowUp" || key === "ArrowDown") {
        e.preventDefault();
        if (!e.repeat && phase === "play") toggle();
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      held.delete(key);
      if (key === " ") firing = false;
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("blur", release);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      update(Math.min((now - last) / 1000, 0.05));
      last = now;
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    api.current = {
      toggle: () => phase === "play" && toggle(),
      setMuted: sound.setMuted,
    };

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("blur", release);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      sound.close();
      api.current = null;
    };
  }, []);

  const next: Bit = mode === 0 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        // Focused on mount so keys reach the game, never tabbed to, so the
        // site's global focus ring would only frame it for no reason.
        tabIndex={-1}
        style={{ outline: "none", WebkitTouchCallout: "none" }}
        aria-label="Qubit Blaster game. Use the mouse or arrow keys to move, click or Space to fire, X to switch state."
        className="block aspect-[2/3] w-full max-w-[min(100%,calc((100dvh_-_8.5rem)*2/3))] sm:w-[min(720px,calc(100vw_-_2rem),calc((100dvh_-_8.5rem)*2/3))] sm:max-w-none cursor-crosshair touch-none select-none"
      />
      <div className="flex w-full max-w-[min(100%,calc((100dvh_-_8.5rem)*2/3))] gap-2 sm:w-[min(720px,calc(100vw_-_2rem),calc((100dvh_-_8.5rem)*2/3))] sm:max-w-none">
        <button
          type="button"
          // Switches on touch-down, not click: a phone player is often holding
          // fire with one finger, and a second finger's tap is not reliably
          // turned into a click. `detail === 0` keeps Enter/Space working.
          onPointerDown={(e) => {
            e.preventDefault();
            api.current?.toggle();
          }}
          onClick={(e) => {
            if (e.detail === 0) api.current?.toggle();
          }}
          className="flex-1 touch-manipulation select-none border border-purple px-3 py-3 font-pixel text-xs uppercase tracking-[0.2em] text-purple transition-colors hover:bg-purple hover:text-bg"
        >
          Switch to |{next}⟩{" "}
          <span className="hidden opacity-60 [@media(pointer:fine)]:inline">(X)</span>
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => {
            const value = !muted;
            setMuted(value);
            api.current?.setMuted(value);
          }}
          aria-pressed={muted}
          className="touch-manipulation select-none border border-line px-3 py-3 font-pixel text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-purple hover:text-purple"
        >
          {muted ? "Sound off" : "Sound on"}
        </button>
      </div>
    </div>
  );
}
