import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ⚡ The clean, standard Next.js Monorepo Root setup
  turbopack: {
    root: path.join(__dirname, "../../"),
  },

  experimental: {
    // 🎯 FIX 1: Move aliases into their proper type-safe experimental engine nest
    turbo: {
      resolveAlias: {
        "@/*": ["./src/*", "./*"],
      },
    },

    // 🎯 FIX 2: Typecast to bypass the rigid, shifting ExperimentalConfig type checks
    ...({
      allowedDevOrigins: [
        "localhost:3000",
        "192.168.55.192:3000",
        "192.168.126.192:3000",
      ],
    } as any),
  },
};

export default nextConfig;
