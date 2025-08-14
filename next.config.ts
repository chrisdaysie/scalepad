import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    devIndicators: {
      buildActivity: false,
    },
  },
};

export default nextConfig;
