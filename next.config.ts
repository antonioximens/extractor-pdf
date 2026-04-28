import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: "./src/lib/empty-module.js",
    },
  },
  // Suprime warnings de config inválida
  reactStrictMode: true,
};

export default nextConfig;
