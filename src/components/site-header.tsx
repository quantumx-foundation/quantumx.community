import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { container } from "./ui";
import { DISCORD_URL, navLinks } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className={`${container} py-6`}>
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 font-pixel text-sm uppercase tracking-[0.2em] text-pink">
          <LogoMark className="h-5 w-auto" />
          QuantumX
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm text-muted md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-fg">
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-pixel text-sm uppercase tracking-[0.2em] text-pink hover:text-fg"
        >
          Discord ↗
        </a>
      </div>
      <nav aria-label="Main (mobile)" className="-mx-4 mt-4 flex gap-5 overflow-x-auto px-4 text-sm text-muted [scrollbar-width:none] md:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="shrink-0 py-2 hover:text-fg">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
