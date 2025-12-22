import { defineConfig } from 'vitest/config';

export default defineConfig({
    base: './',
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.{ts,tsx}'], 
            exclude: [
                'src/**/*.test.{ts,tsx}',
                'src/test/**',
                'src/setupTests.ts',
                '**/*.d.ts'
            ],
        },
    },
})