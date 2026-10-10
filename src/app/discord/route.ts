import { NextResponse } from "next/server";

// Always run on request so the hit shows up in logs and analytics.
export const dynamic = "force-dynamic";

/** Short link: quantumx.community/discord -> /join, which asks for an email before the invite. */
export function GET(request: Request) {
  const url = new URL(request.url);
  const ref = url.searchParams.get("ref");
  console.log(`short-link /discord${ref ? ` ref=${ref}` : ""}`);
  return NextResponse.redirect(new URL(`/join${url.search}`, url), 307);
}
