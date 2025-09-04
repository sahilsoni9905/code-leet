import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://13.201.255.178:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api/problems': {
        target: 'http://3.111.163.113:3002',
        changeOrigin: true,
        secure: false,
      },
      '/api/submissions': {
        target: 'http://13.203.186.121:3003',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});