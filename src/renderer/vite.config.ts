import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: __dirname,
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    dedupe: ['react', 'react-dom']
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: resolve(__dirname, '../../dist/web'),
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
})
