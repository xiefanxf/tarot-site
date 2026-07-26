import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base: './',
  plugins: command === 'serve' && !isPreview ? [inspectAttr(), react()] : [react()],
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
