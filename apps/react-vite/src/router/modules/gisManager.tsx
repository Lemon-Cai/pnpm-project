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

//
const Induction = LazyLoad(lazy(() => import('@/pages/GisManager/Cesium/Induction')))
const Advance = LazyLoad(lazy(() => import('@/pages/GisManager/Cesium/Advance')))
const CesiumCase03 = LazyLoad(lazy(() => import('@/pages/GisManager/Cesium/Case_03')))
const CesiumCase04 = LazyLoad(lazy(() => import('@/pages/GisManager/Cesium/Case_04')))

const MapboxglCase01 = LazyLoad(lazy(() => import('@/pages/GisManager/Mapboxgl/Case_01')))
const MapboxglCase02 = LazyLoad(lazy(() => import('@/pages/GisManager/Mapboxgl/Case_01')))

const routeList: RouteObject[] = [
  {
    path: '/gisManager',
    name: 'GIS管理',
    element: <LayoutGuard />,
    children: [
      {
        path: 'cesium',
        name: 'Cesium',
        meta: {
          title: 'Cesium',
          key: 'gisManager_cesium'
        },
        children: [
          {
            path: 'induction',
            name: '地图入门',
            meta: {
              title: '地图入门',
              key: 'gisManager_cesium_induction'
            },
            element: Induction
          },
          {
            path: 'advance',
            name: '地图进阶',
            meta: {
              title: '地图进阶',
              key: 'gisManager_cesium_advance'
            },
            element: Advance
          },
          {
            path: 'case03',
            name: '案例三',
            meta: {
              title: '案例三',
              key: 'gisManager_cesium_case03'
            },
            element: CesiumCase03
          },
          {
            path: 'case04',
            name: '案例四',
            meta: {
              title: '案例四',
              key: 'gisManager_cesium_case04'
            },
            element: CesiumCase04
          }
        ]
      },
      {
        path: 'mapboxgl',
        name: 'mapboxgl',
        meta: {
          title: 'mapboxgl',
          key: 'gisManager_mapboxgl'
        },
        // element: <Mapboxgl />,
        children: [
          {
            path: 'case_01',
            name: '案例一',
            meta: {
              title: '案例一',
              key: 'gisManager_mapboxgl_case_01'
            },
            element: MapboxglCase01
          },
          {
            path: 'case_02',
            name: '案例二',
            meta: {
              title: '案例二',
              key: 'gisManager_mapboxgl_case_02'
            },
            element: MapboxglCase02
          }
        ]
      }
    ]
  }
] as RouteObject[]
export default routeList
