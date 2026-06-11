import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'index.css'
          }

          return 'assets/[name][extname]'
        },
      },
    },
  },
  server: {
    cors: true,
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/partners': 'http://127.0.0.1:8787',
      '/health': 'http://127.0.0.1:8787',
    },
  },
})
