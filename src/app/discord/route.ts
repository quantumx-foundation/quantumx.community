// Always run on request so the hit shows up in logs and analytics.
export const dynamic = "force-dynamic";

/** Short link: quantumx.community/discord -> /join, which asks for an email before the invite. */
export function GET(request: Request) {
  const url = new URL(request.url);
  // Trimmed the way inviteFor() trims it, and stripped to a slug so it cannot fake log lines.
  const ref = url.searchParams.get("ref")?.slice(0, 40).replace(/[^\w-]/g, "");
  console.log(`short-link /discord${ref ? ` ref=${ref}` : ""}`);
  // Relative, because on Netlify request.url can carry the deploy's own
  // *.netlify.app host rather than the domain the visitor typed.
  return new Response(null, { status: 307, headers: { Location: `/join${url.search}` } });
}
