import { defineConfig } from 'vite';
import browserslistToEsbuild from 'browserslist-to-esbuild'
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react(),
  ],
  server: {  
    proxy: {
      '/api': {
        target: 'http://localhost:5000', 
        changeOrigin: true, 
      },
    },
  },
  esbuild: {
    /**
     * Prevents ESBuild to throw when using a feature not supported by the
     * list of supported browsers coming from the `browserslist` file.
     */
    supported: {
      'top-level-await': true,
    },
  },
  build: {
    outDir: 'build',
    target: browserslistToEsbuild(),
  },
});