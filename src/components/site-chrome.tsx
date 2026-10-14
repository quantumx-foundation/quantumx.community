"use client";

import { usePathname } from "next/navigation";

/** Routes that run full screen, with no site header or footer around them. */
const BARE_ROUTES = new Set(["/game"]);

/**
 * Wraps the site header and footer in the root layout and drops them on bare
 * routes. The header and footer stay server components; they are passed in
 * as children, so only this path check runs in the browser.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return BARE_ROUTES.has(pathname) ? null : children;
}
