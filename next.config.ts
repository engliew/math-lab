import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  serverExternalPackages: ["bcryptjs"],
};

export default nextConfig;
