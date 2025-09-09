/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true 
  },
  // File upload handling is managed through app router API routes
  // Optimize for production
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
