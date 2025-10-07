/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Enable memory-efficient features
    memoryBasedWorkersCount: true,
    // Disable heavy experimental features in development
    ...(process.env.NODE_ENV === 'development' && {
      // Disable Turbopack for lower memory usage
      turbo: false,
    }),
  },
  
  // Remove deprecated swcMinify option (it's enabled by default in Next.js 15)
  // swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Development optimizations for low memory usage
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev }) => {
      if (dev) {
        // Reduce file watching overhead
        config.watchOptions = {
          poll: 2000, // Reduced polling frequency
          aggregateTimeout: 500, // Increased timeout
          ignored: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
        };
        
        // Memory-efficient optimization
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 244000,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10,
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
          // Reduce memory usage
          usedExports: false,
          sideEffects: false,
        };
        
        // Reduce memory footprint
        config.cache = {
          type: 'memory',
          maxGenerations: 1,
        };
      }
      return config;
    },
  }),
  
  // Add outputFileTracingRoot to fix workspace root warning
  outputFileTracingRoot: process.cwd(),
  
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
