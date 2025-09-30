import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uncomment the following lines for static export deployment
  // output: 'export',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true
  // },
  
  // Standard configuration
  experimental: {
    turbo: {}
  },
  
  // Enable static generation for all pages
  generateStaticParams: true,
};

export default nextConfig;
