/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable experimental features for performance
    experimental: {
        // Optimize package imports for common libraries
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },

    // Enable compression
    compress: true,

    // Production optimizations
    productionBrowserSourceMaps: false,

    // Webpack optimizations
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'vendors',
                            chunks: 'all',
                        },
                    },
                },
            };
        }
        return config;
    },

    // Headers for caching
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                ],
            },
            {
                source: '/:path(.+\\.(?:ico|png|svg|jpg|jpeg|gif|webp|js|css))',
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
