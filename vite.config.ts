import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pluginSsrDevCssFix } from './plugins/ssr-css' 

export default defineConfig({
  plugins: [react(), pluginSsrDevCssFix()],
  css: {
    postcss: './postcss.config.js', 
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
