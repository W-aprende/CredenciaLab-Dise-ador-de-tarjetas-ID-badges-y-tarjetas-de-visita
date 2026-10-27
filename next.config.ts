import type { NextConfig } from "next";

/*
 * Nota: no se usa `output: "standalone"` para que `npm run build` + `npm start`
 * funcionen de forma estándar en cualquier ordenador (Windows / macOS / Linux)
 * sin pasos de copiado adicionales.
 */
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
