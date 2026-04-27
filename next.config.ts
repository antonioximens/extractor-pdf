import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CORREÇÃO 1: 'serverComponentsExternalPackages' saiu de 'experimental'
  // e agora é 'serverExternalPackages' na raiz.
  serverExternalPackages: ["pdfjs-dist"],

  // CORREÇÃO 2: Como você está usando Turbopack, precisamos dizer como ele
  // deve lidar com o alias do 'canvas', similar ao que fazíamos no Webpack.
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.js", // Veja a nota abaixo sobre este arquivo
      },
    },
  },

  // Mantemos o webpack para compatibilidade caso você rode com --webpack
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
