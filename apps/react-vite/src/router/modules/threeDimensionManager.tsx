/*
 * @Author: CP
 * @Date: 2024-07-05 08:52:39
 * @Description:
 */
// import { lazy } from 'react'
import { lazy } from '@loadable/component'

import { LazyLoad } from '@/components/LazyLoad'

import { RouteObject } from '../types'

const LayoutGuard = lazy(() => import('@/layout'))

//
const FirstCase = LazyLoad(lazy(() => import('@/pages/ThreeDimensionManager/ThreeJs/FirstCase')))
const SecondCase = LazyLoad(lazy(() => import('@/pages/ThreeDimensionManager/ThreeJs/SecondCase')))
const Earth = LazyLoad(lazy(() => import('@/pages/ThreeDimensionManager/ThreeJs/Earth')))
const ThreeRain = LazyLoad(lazy(() => import('@/pages/ThreeDimensionManager/ThreeJs/ThreeRain')))

const WebGL = LazyLoad(lazy(() => import('@/pages/ThreeDimensionManager/WebGL')))

const routeList: RouteObject[] = [
  {
    path: '/threeDimensionManager',
    name: '三维管理',
    // meta: {
    //   title: '三维管理',
    //   key: 'threeDimensionManager'
    // },
    element: <LayoutGuard />,
    children: [
      {
        path: 'threeJs',
        name: 'ThreeJs',
        meta: {
          title: 'ThreeJs',
          key: 'threeDimensionManager_threeJs'
        },
        children: [
          {
            path: 'firstCase',
            name: '案例一',
            meta: {
              title: '案例一',
              key: 'threeDimensionManager_threeJs_firstCase'
            },
            element: FirstCase
          },
          {
            path: 'secondCase/:geometryType?',
            name: '案例二',
            meta: {
              title: '案例二',
              key: 'threeDimensionManager_threeJs_secondCase'
            },
            element: SecondCase
          },
          {
            path: 'earth',
            name: '地球',
            meta: {
              title: '地球',
              key: 'threeDimensionManager_threeJs_earth'
            },
            element: Earth
          },
          {
            path: 'threeRain',
            name: '下雨',
            meta: {
              title: '下雨',
              key: 'threeDimensionManager_threeJs_threeRain'
            },
            element: ThreeRain
          }
        ]
      },
      {
        path: 'webGL',
        name: 'WebGL',
        meta: {
          title: 'WebGL',
          key: 'threeDimensionManager_webGL'
        },
        element: WebGL
      }
    ]
  }
] as RouteObject[]
export default routeList
