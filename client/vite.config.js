import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The client dev server proxies /api to the Node/Express back end in server/.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Emit to the repo root, not client/dist. Vercel's Vite detection looks for
    // `<root>/dist` and that wins over vercel.json#outputDirectory, so putting
    // the build there keeps both in agreement.
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
