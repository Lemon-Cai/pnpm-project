/*
 * @Author: CP
 * @Date: 2023-11-10 17:36:36
 * @Description: 
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import axios from 'axios'

import App from './App.vue'
import router from './router'

import { install } from '@/components'

//导入mock
import worker from './mock/index'

import './assets/main.css'

if (import.meta.env.MODE === "development") {
  worker.start();
}

const app = createApp(App)

app.config.globalProperties.$axios = axios;  //配置axios的全局引用

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

install(app)

app.mount('#app')
