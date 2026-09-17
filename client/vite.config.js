import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://server-lw98.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://server-lw98.vercel.app',
        changeOrigin: true,
      },
    },
  },
});
