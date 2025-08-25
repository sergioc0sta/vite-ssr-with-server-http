import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pluginSsrDevCssFix } from './plugins/ssr-css'

export default defineConfig({
  plugins: [react(), pluginSsrDevCssFix()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
