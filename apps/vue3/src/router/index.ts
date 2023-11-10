/*
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home/index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/container',
      name: 'container',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Container/index')
    },
    {
      path: '/map/openlayers',
      name: 'openlayers',
      component: () => import('../views/Map/Openlayers/index')
    },
    {
      path: '/map/olAnimate',
      name: 'OlAnimate',
      component: () => import('../views/Map/OlAnimate')
    },
    {
      path: '/map/olBlinking',
      name: 'OlBlinking',
      component: () => import('../views/Map/OlBlinking')
    },
    // {
    //   path: '/map',
    //   component: () => import('../views/Map/index'),

    //   children: [
    //     {
    //       path: '/openlayers',
    //       name: 'openlayers',
    //       component: () => import('../views/Map/Openlayers/index')
    //     }
    //   ]
    // }
  ]
})

export default router
