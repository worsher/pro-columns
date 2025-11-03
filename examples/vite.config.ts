import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'pro-columns/components': resolve(__dirname, '../components'),
      'pro-columns/strategy': resolve(__dirname, '../strategy'),
      'pro-columns/type': resolve(__dirname, '../type'),
      'pro-columns': resolve(__dirname, '../index.ts'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
