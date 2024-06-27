/*
 * @Author: CP
 * @Date: 2024-06-20 17:21:55
 * @Description: 
 */
import { defineConfig } from 'vite'
import path from 'node:path'

import react from '@vitejs/plugin-react'

import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({ svgrOptions: { icon: true } })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'mock': path.resolve(__dirname, 'mock'),
    },
  },
  server: {
    cors: true,
    proxy: {
      "/api": {
        target: "http://8.140.255.30:3010",
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
})
