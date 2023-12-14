/*
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from "vite-plugin-mock"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // '/api': {
      //   // target: PROXY_URL, // 本地
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, "/api"),
      //   ws: true,
      // },
      // '/mock': {
      //   // target: PROXY_URL, // 本地
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, "/mock"),
      //   ws: true,
      // },
    },
    // hmr: {
    //   port: 5173,
    // },
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteMockServe({
      // supportTs: true
      // mockPath: "./src/mock",
      enable: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
