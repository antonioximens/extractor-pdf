import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: "./src/lib/empty-module.js",
    },
  },
  // Corrige warnings de config inválida para o deploy
  reactStrictMode: true,
};

export default nextConfig;
