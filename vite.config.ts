import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4020,
    open: false,
    strictPort: true,
  },
  base: '/raffle-draw/',
  resolve: {
    alias: {
      '@/magicui': path.resolve(__dirname, './src/components/magicui'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  preview: {
    port: 4020,
    strictPort: true,
    allowedHosts: true,
  },
});
