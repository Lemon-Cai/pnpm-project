
import * as VueRouter from 'vue-router'
import type { Router } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  }
]

const router: Router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
})


export default router