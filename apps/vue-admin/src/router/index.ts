import * as VueRouter from 'vue-router'
import type { Router } from 'vue-router'
import StaticRoutes from './static'

const routes = [...StaticRoutes]

const router: Router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
})

export default router
