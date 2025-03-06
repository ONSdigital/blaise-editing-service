import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom', 
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
        poolOptions: {
            threads: {
                minThreads: 1,
                maxThreads: 4,
            },
        },
    },
})