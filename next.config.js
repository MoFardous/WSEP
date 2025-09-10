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
  // Fix webpack chunk loading issues and rate limiting
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Reduce chunk splitting to prevent 429 errors
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              priority: 30,
              chunks: 'all',
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
  // Optimize for Vercel deployment with better caching
  compress: true,
  poweredByHeader: false,
  // Better chunk loading strategy
  experimental: {
    esmExternals: true,
  },
  // Reduce concurrent requests to prevent rate limiting
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Add better error handling
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
