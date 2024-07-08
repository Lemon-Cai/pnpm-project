/*
 * @Author: CP
 * @Date: 2024-07-05 08:52:39
 * @Description:
 */
// import { lazy } from 'react'
import { lazy } from '@loadable/component'

import { LazyLoad } from '@/components/LazyLoad'

import LayoutGuard from '@/layout'
import { RouteObject } from '../types'

// const LayoutGuard = lazy(() => import('@/layout'))


const LowCodePlatform = LazyLoad(lazy(() => import('@/pages/LowCodePlatform')))

const routeList: RouteObject[] = [
  {
    path: '/lowCodePlatform',
    name: 'LowCode平台',
    element: <LayoutGuard />,
    children: [
      {
        path: 'index',
        name: '低代码',
        meta: {
          title: '低代码',
          key: 'lowCodePlatform_index'
        },
        element: LowCodePlatform,
      },
    ]
  }
] as RouteObject[]
export default routeList
