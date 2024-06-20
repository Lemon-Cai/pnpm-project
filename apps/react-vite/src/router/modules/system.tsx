import { lazy } from 'react'
import { RouteObject } from '../types'


// system
const Menu = lazy(() => import('@/pages/System/Menu'))

const routeList: RouteObject[] = [
  {
    path: '/menu',
    name: 'Menu',
    meta: {
      title: '菜单管理',
      key: 'menu_manager_00001'
    },
    element: <Menu />,
  },
]
export default routeList