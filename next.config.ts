import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ✅ NEW: Move out of 'experimental' and rename to 'turbopack'
  turbopack: {
    // This tells Turbopack where the root of your workspace is
    root: path.join(__dirname, "../../"),
  },
};

export default nextConfig;
