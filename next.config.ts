import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer ships native-ish deps that must not be bundled.
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    // Candidate photos travel inside the JSON body as data URLs.
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;
