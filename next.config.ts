import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false, // hide the floating Next.js "N" badge in development
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // allow image uploads from the admin panel
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
