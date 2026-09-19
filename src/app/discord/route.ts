import { NextResponse } from "next/server";
import { inviteFor } from "@/lib/site";

// Always run on request so the hit shows up in logs and analytics.
export const dynamic = "force-dynamic";

/** Short link: quantumx.community/discord -> the Discord invite. */
export function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref");
  console.log(`short-link /discord${ref ? ` ref=${ref}` : ""}`);
  return NextResponse.redirect(inviteFor("discord", ref), 307);
}
