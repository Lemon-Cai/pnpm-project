/*
 * @Author: CP
 * @Date: 2024-06-20 17:21:55
 * @Description:
 */
import { defineConfig } from 'vite'
import path from 'node:path'

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

import { viteStaticCopy } from 'vite-plugin-static-copy'

const cesiumPlugin = () => {
  const cesiumSource = 'node_modules/cesium/Build/Cesium'
  const cesiumBaseUrl = 'cesiumStatic'

  return viteStaticCopy({
    targets: [
      { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
      { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
      { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
      { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl }
    ]
  })
  // return {
  //   name: 'cesium-plugin',
  //   // transform: () => {},
  //   config: async () => {
  //   },
  // }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify('cesiumStatic')
  },
  plugins: [react(), cesiumPlugin(), svgr({ svgrOptions: { icon: true } })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      mock: path.resolve(__dirname, 'mock')
    }
  },
  server: {
    cors: true,
    proxy: {
      '/api': {
        target:
          process.env.NODE_ENV === 'production'
            ? 'http://8.140.255.30:3010'
            : 'http://localhost:3010',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      // 打包配置
      // 分片
      // manualChunks(id: string) {
      //   // id
      // }
    }
  }
})
