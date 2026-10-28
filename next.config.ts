import type { NextConfig } from "next";

// The /join and /discord short links are handled by route handlers rather than
// config redirects, so each hit is logged and tagged. See src/app/join/route.ts.
const nextConfig: NextConfig = {
  // Every response. netlify.toml sets the same on static files, which the
  // Netlify CDN serves without asking Next. The CSP only carries directives
  // that cannot break a script or a style: who may frame the site, where
  // forms may post, and no plugins or <base> tricks.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
