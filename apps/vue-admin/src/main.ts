import { createApp } from 'vue'
// store
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import router from '@/router'
// 全局注册 antd
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import './style.css'
import App from './App.vue'

// 创建store，配置可持久化，避免刷新导致数据丢失
const pinia = createPinia()
pinia.use(
  createPersistedState({
    // storage: sessionStorage,
    key: (id) => `__yl__${id}`, // 存储的key会自动拼接__yl__前缀
  })
)

const app = createApp(App)

app.use(Antd).use(pinia).use(router).mount('#app')
