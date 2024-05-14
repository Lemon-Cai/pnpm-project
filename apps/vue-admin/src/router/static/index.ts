/*
 * @Author: CP
 * @Date: 2024-05-13 14:32:19
 * @Description: 
 */

const routes = [
  {
    path: '/login',
    component: () => import('@/pages/Login')
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/searchTree',
    component: () => import('@/views/SearchTree/index.vue')
  },
  
]

export default routes