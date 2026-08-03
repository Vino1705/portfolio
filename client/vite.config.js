import { resolve } from 'node:path';

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
    // client/dist — matches vercel.json#outputDirectory. Do not move this
    // without changing that file and the Express static path together.
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // Two pages: the portfolio itself and the standalone résumé at
      // /resume.html. Both share tokens.css and base.css.
      input: {
        main: resolve(__dirname, 'index.html'),
        resume: resolve(__dirname, 'resume.html'),
      },
    },
  },
});
