import type { Metadata } from "next";
import { FortuneCookie } from "@/components/fortune-cookie";
import { QubitPreview } from "@/components/qubit-preview";
import { QuantumLoops } from "@/components/quantum-loops";
import { Button, PageHero, container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Qubit Blaster, a tiny arcade game about qubits, plus quantum jokes and a fortune cookie that only decides when you open it.",
  alternates: { canonical: "/play" },
};

/** The lighter side of the community, kept off the homepage so it can lead with what we've done. */
export default function PlayPage() {
  return (
    <>
      <PageHero eyebrow="Play" title="Quantum, for fun">
        A two-minute game, a few jokes for anyone who has waited on a job queue, and a fortune cookie.
      </PageHero>

      {/* Game */}
      <section aria-labelledby="game-title" className={`${container} py-16`}>
        <div className="grid items-center gap-10 border border-line p-6 sm:p-10 md:grid-cols-2">
          <div>
            <h2 id="game-title" className="text-4xl tracking-tight sm:text-5xl">
              Qubit Blaster
            </h2>
            <p className="mt-4 max-w-sm text-muted">
              A tiny arcade game about qubits. Match 0 and 1, measure a superposition and watch an entangled pair
              collapse together. Two minutes, no maths, works on your phone.
            </p>
            <div className="mt-8">
              <Button href="/game">Play now</Button>
            </div>
          </div>
          <QubitPreview />
        </div>
      </section>

      {/* Loops */}
      <section aria-labelledby="loops-title" className={`${container} py-16`}>
        <h2 id="loops-title" className="text-4xl tracking-tight sm:text-5xl">
          Quantum, but make it funny
        </h2>
        <p className="mt-4 max-w-xl text-muted">For everyone who has ever waited on a job queue.</p>
        <div className="mt-12">
          <QuantumLoops />
        </div>
      </section>

      {/* Fortune cookie */}
      <section aria-labelledby="fortune-title" className={`${container} py-16 pb-24`}>
        <div className="grid items-center gap-10 border border-line p-6 sm:p-10 md:grid-cols-2">
          <div>
            <h2 id="fortune-title" className="text-4xl tracking-tight sm:text-5xl">
              Quantum fortune
            </h2>
            <p className="mt-4 max-w-sm text-muted">
              Crack the cookie and see what the wavefunction has in store for you. Results not guaranteed until
              measured.
            </p>
          </div>
          <FortuneCookie />
        </div>
      </section>
    </>
  );
}
