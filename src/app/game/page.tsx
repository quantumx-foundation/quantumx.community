import type { Metadata } from "next";
import { GameStage } from "@/components/game-stage";

export const metadata: Metadata = {
  title: "Qubit Blaster",
  description:
    "A tiny arcade game about qubits: match 0 and 1, measure superpositions and collapse entangled pairs. Plays on phone and desktop.",
  alternates: { canonical: "/game" },
};

export default function GamePage() {
  return <GameStage />;
}
