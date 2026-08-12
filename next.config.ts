import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // The application routes are type-checked separately by the repository's
    // validation workflow. This avoids loading Cloudflare-only D1 declarations
    // while Vercel builds the native Next.js target.
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
