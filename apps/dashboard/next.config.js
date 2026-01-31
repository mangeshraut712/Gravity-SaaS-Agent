/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable experimental features for performance
    experimental: {
        // Temporarily disable optimizePackageImports to avoid dev runtime
        // module resolution issues in the app router.
        // optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
        // CSS optimization disabled - requires critters package
        // optimizeCss: true,
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
    },

    // Enable compression
    compress: true,

    // Production optimizations
    productionBrowserSourceMaps: false,

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
        ];
    },
};

module.exports = nextConfig;
