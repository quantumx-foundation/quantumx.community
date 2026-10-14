import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { QuantumShooter } from "./quantum-shooter";

/**
 * The /game page body: the game, full screen, straight away.
 *
 * The site header and footer are dropped on this route (see SiteChrome), so
 * the stage is exactly one screen tall: a title row, then the game sized to
 * the height that leaves. Exit is the one way back to the site, like Close on
 * the QFF26 popup.
 */
export function GameStage() {
  return (
    <section
      aria-label="Qubit Blaster, a quantum game"
      className="mx-auto flex h-dvh w-full flex-col px-4 pb-4 sm:w-fit"
    >
      <div className="flex items-center justify-between gap-4 py-4">
        <h1 className="flex items-center gap-2.5 font-pixel text-sm uppercase tracking-[0.2em] text-pink">
          <LogoMark className="h-4 w-auto" />
          Qubit Blaster
        </h1>
        <Link
          href="/"
          className="font-pixel text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-pink"
        >
          Exit ✕
        </Link>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <QuantumShooter />
      </div>
    </section>
  );
}
