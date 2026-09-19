import Link from "next/link";
import { BitStrip } from "./animations";
import { LogoMark } from "./logo-mark";
import { PixelLogo } from "./pixel-logo";
import { Button, container } from "./ui";
import { DISCORD_URL, EVENTS_EMAIL, FOUNDATION_URL, formingChapters, liveChapters, listNames, navLinks, socials } from "@/lib/site";

const more = [
  { label: "Start a chapter", href: "/chapters/apply" },
  { label: "Event support", href: "/events/support" },
  { label: "Code of conduct", href: "/code-of-conduct" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24">
      <div className={`${container} grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]`}>
        <div>
          <LogoMark className="mb-6 h-10 w-auto text-pink" />
          <PixelLogo size="sm" />
          <p className="mt-8 max-w-xs text-sm text-muted">
            Live in {listNames(liveChapters)}. {formingChapters.length} chapters forming. A community of the{" "}
            <a href={FOUNDATION_URL} className="text-fg underline decoration-dotted underline-offset-4 hover:text-pink">
              QuantumX Foundation
            </a>
            .
          </p>
          <div className="mt-8">
            <Button href={DISCORD_URL}>Join the Discord</Button>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Community</p>
          <ul className="mt-4 space-y-3">
            {[...navLinks, ...more].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-pink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Elsewhere</p>
          <ul className="mt-4 space-y-3">
            {socials.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-pink">
                  {link.label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${EVENTS_EMAIL}`} className="hover:text-pink">
                {EVENTS_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className={`${container} pb-8 text-sm text-muted`}>© {new Date().getFullYear()} QuantumX Community</p>
      <BitStrip />
    </footer>
  );
}
