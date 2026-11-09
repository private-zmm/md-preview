import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: resolve(process.cwd(), 'src/renderer'),
  base: './',
  plugins: [vue()],
  build: {
    outDir: resolve(process.cwd(), 'dist-web'),
    emptyOutDir: true
  },
  server: {
    host: '0.0.0.0'
  },
  preview: {
    host: '0.0.0.0'
  }
})
