import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
    },
    resolve: {
        alias: {
            '@gravity/types': path.resolve(__dirname, 'packages/types/src/index.ts'),
            '@gravity/db': path.resolve(__dirname, 'packages/db/src/index.ts'),
            '@gravity/memory': path.resolve(__dirname, 'packages/memory/src/index.ts'),
            '@gravity/mcp-client': path.resolve(__dirname, 'packages/mcp-client/src/index.ts'),
            '@/': path.resolve(__dirname, 'apps/dashboard/src') + '/',
        },
    },
    test: {
        globals: true,
        environment: 'node',
        setupFiles: [path.resolve(__dirname, './tests/setup.ts')],
        testTimeout: 20000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'lcov'],
            include: [
                'apps/gateway/src/**/*.ts',
                'apps/dashboard/src/**/*.{ts,tsx}',
                'packages/*/src/**/*.ts',
            ],
            exclude: [
                '**/*.d.ts',
                '**/*.test.ts',
                '**/*.spec.ts',
                'apps/dashboard/next-env.d.ts',
            ],
        },
    },
});
