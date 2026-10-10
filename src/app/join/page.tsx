import type { Metadata } from "next";
import { DiscordGate } from "@/components/discord-gate";
import { PageHero, container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Join the Discord",
  description:
    "Get the invite to the QuantumX Community Discord, where every chapter, event and study circle starts.",
  alternates: { canonical: "/join" },
};

/** Short link: quantumx.community/join. Hands out the Discord invite for an email. */
export default function JoinPage() {
  return (
    <>
      <PageHero eyebrow="Discord" title="Everything starts on Discord">
        Chapters, events, study circles and the people behind them. Leave your email and the invite is yours.
      </PageHero>
      <section aria-label="Get the invite" className={`${container} pb-16`}>
        <DiscordGate source="join" ask />
      </section>
    </>
  );
}
