import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react(),
  ],
  server: {  
    proxy: {
      '/api': {
        changeOrigin: false, 
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});