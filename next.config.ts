import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Node.js-only DB packages from being bundled into middleware
  serverExternalPackages: [
    "ws",
    "@prisma/adapter-neon",
    "@prisma/adapter-pg",
    "@neondatabase/serverless",
  ],

  // Avoid "Blocked cross-origin request" in dev when mixing localhost and 127.0.0.1
  allowedDevOrigins: ["localhost:3000", "127.0.0.1:3000", "localhost:3001", "127.0.0.1:3001"],

  // Log all server-side fetch() calls with full URLs and cache status
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },

  images: {
    remotePatterns: [
      // Google OAuth profile pictures
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // GitHub OAuth avatars
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
