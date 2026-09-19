import type { NextConfig } from "next";

// The /join and /discord short links are handled by route handlers rather than
// config redirects, so each hit is logged and tagged. See src/app/join/route.ts.
const nextConfig: NextConfig = {};

export default nextConfig;
