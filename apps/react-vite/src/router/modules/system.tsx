/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description: 
 */
// import { lazy } from 'react'
import { lazy } from '@loadable/component'

import { LazyLoad } from '@/components/LazyLoad'

import LayoutGuard from '@/layout'
import { RouteObject } from '../types'

// const LayoutGuard = lazy(() => import('@/layout'))

// system
const Menu = LazyLoad(lazy(() => import('@/pages/System/Menu')))

const routeList: RouteObject[] = [
  {
    path: '/system',
    name: '系统管理',
    meta: {
      title: '系统管理',
      key: 'system'
    },
    element: <LayoutGuard />,
    children: [
      {
        path: 'menu',
        name: '菜单管理',
        meta: {
          title: '菜单管理',
          key: 'system_menu'
        },
        element: Menu
      }
    ]
  }
] as RouteObject[]
export default routeList
