/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @LastEditors: Please set LastEditors
 * @Description: 
 */
/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @LastEditors: 
 * @Description: 
 */
import { createApp } from 'vue'

// 全局注册 antd
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import store from '@/store'
import router from '@/router'

import '@/style/main.scss'
import App from '@/App.vue'

//导入mock
import worker from '@/mock/index'

if (import.meta.env.MODE === "development") {
  worker.start();
}

const app = createApp(App)

app.use(Antd).use(store).use(router).mount('#app')
