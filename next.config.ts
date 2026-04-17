import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid "Blocked cross-origin request" in dev when mixing localhost and 127.0.0.1
  allowedDevOrigins: ["localhost:3000", "127.0.0.1:3000"],

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
