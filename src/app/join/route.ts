import { NextResponse } from "next/server";
import { inviteFor } from "@/lib/site";

// Always run on request so the hit shows up in logs and analytics.
export const dynamic = "force-dynamic";

/** Short link: quantumx.community/join -> the Discord invite. */
export function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref");
  console.log(`short-link /join${ref ? ` ref=${ref}` : ""}`);
  return NextResponse.redirect(inviteFor("join", ref), 307);
}
