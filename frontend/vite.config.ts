import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'https://13.201.255.178',
        changeOrigin: true,
        secure: false,
      },
      '/api/problems': {
        target: 'https://13.201.255.178',
        changeOrigin: true,
        secure: false,
      },
      '/api/submissions': {
        target: 'https://13.201.255.178',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});