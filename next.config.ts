import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable development toolbar
  env: {
    NEXT_DISABLE_DEVTOOLS: 'true',
  },
};

export default nextConfig;
