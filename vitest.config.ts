import { defineConfig } from 'vitest/config';

export default defineConfig({
    base: './',
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        coverage: {
            provider: 'v8', // or 'istanbul'
            reporter: ['text', 'json', 'html'],
            // Why we do this: Defining 'include' here tells Vitest exactly 
            // which source files to track, which replaces the old 'all' flag.
            include: ['src/**/*.{ts,tsx}'], 
            exclude: [
                'src/**/*.test.{ts,tsx}',
                'src/test/**', // Exclude your test folder entirely from coverage
                'src/setupTests.ts',
                '**/*.d.ts'
            ],
        },
    },
})