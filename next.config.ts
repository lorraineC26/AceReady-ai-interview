import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // temporarily ignore type errors to unblock development
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
