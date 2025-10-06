import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uncomment the following lines for static export deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Standard configuration
  turbopack: {}
};

export default nextConfig;
