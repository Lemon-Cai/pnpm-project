
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import axios from 'axios'

import App from './App.vue'
import router from './router'

import { install } from '@/components'

//导入mock
import './mock/index'

import './assets/main.css'

const app = createApp(App)

app.config.globalProperties.$axios=axios;  //配置axios的全局引用

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

install(app)

app.mount('#app')
