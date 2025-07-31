import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds for development
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during builds for development
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.untappd.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // For development
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  env: {
    CUSTOM_KEY: 'brewquest-blog',
  },
  // Configure dev server to bind to all interfaces
  async rewrites() {
    return []
  },
};

export default nextConfig;
