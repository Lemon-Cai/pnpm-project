/*
 * @Author: CP
 * @Date: 2024-05-13 14:32:19
 * @Description: 
 */

const routes = [
  {
    path: '/login',
    name: '登录',
    component: () => import('@/pages/Login')
  },
  {
    path: '/',
    name: '首页',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/searchTree',
    name: '搜索树',
    component: () => import('@/views/SearchTree/index.vue')
  },
  {
    path: '/menuManage',
    name: '菜单管理',
    component: () => import('@/views/System/MenuManage')
  },
]

export default routes