"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "./logo-mark";
import { QuantumShooter } from "./quantum-shooter";

/**
 * The /game page body: the game, straight away, no landing step.
 *
 * On a phone the site header and its second nav row would push the controls
 * below the fold, so the stage is one screen tall and is scrolled to the top
 * on arrival; the header is still one swipe up. From `sm` the header is short
 * enough that the whole game fits beneath it.
 */
export function GameStage() {
  const stage = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    // After Next's own scroll-to-top on navigation has run.
    const id = requestAnimationFrame(() => stage.current?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      ref={stage}
      aria-label="Qubit Blaster, a quantum game"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-4 sm:min-h-0 sm:pb-12"
    >
      <h1 className="flex items-center gap-2.5 py-4 font-pixel text-sm uppercase tracking-[0.2em] text-pink">
        <LogoMark className="h-4 w-auto" />
        Qubit Blaster
      </h1>
      <div className="flex flex-1 flex-col justify-center">
        <QuantumShooter />
      </div>
    </section>
  );
}
