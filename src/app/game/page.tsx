import type { Metadata } from "next";
import { GameStage } from "@/components/game-stage";

const title = "Qubit Blaster";
const description =
  "A tiny arcade game about qubits: match 0 and 1, measure superpositions and collapse entangled pairs. Plays on phone and desktop.";

// openGraph and twitter are set in full here: a page that sets neither
// inherits the layout's, which would share this link as the homepage
// ("QuantumX Community", url "/"). The images come from opengraph-image.tsx
// and twitter-image.tsx beside this file.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/game" },
  openGraph: {
    type: "website",
    url: "/game",
    siteName: "QuantumX Community",
    title: `${title} · QuantumX Community`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · QuantumX Community`,
    description,
  },
};

export default function GamePage() {
  return <GameStage />;
}
