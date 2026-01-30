/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable experimental features for performance
    experimental: {
        // Optimize package imports for common libraries
        optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
        // Optimize CSS
        optimizeCss: true,
    },

    // Compiler optimizations
    compiler: {
        // Remove console.log in production
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },

    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        minimumCacheTTL: 60,
    },

    // Enable compression
    compress: true,

    // Production optimizations
    productionBrowserSourceMaps: false,

    // Power pack for faster builds
    swcMinify: true,

    // Webpack optimizations
    webpack: (config, { dev, isServer }) => {
        // Limit cache size in development
        if (dev && config.cache) {
            config.cache.maxMemoryGenerations = 1;
            config.cache.maxAge = 1000 * 60 * 60 * 24; // 24 hours
        }

        if (!isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor chunk
                        vendor: {
                            name: 'vendor',
                            test: /[\\/]node_modules[\\/]/,
                            chunks: 'all',
                            priority: 20,
                        },
                        // Common chunk
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                        // React and React-DOM in separate chunk
                        react: {
                            name: 'react',
                            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                            chunks: 'all',
                            priority: 30,
                        },
                    },
                },
            };
        }

        return config;
    },

    // Headers for caching and security
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                ],
            },
            {
                source: '/:path(.+\\.(?:ico|png|svg|jpg|jpeg|gif|webp|avif|js|css))',
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
