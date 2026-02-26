import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // 🔥 Docker এর জন্য best

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;