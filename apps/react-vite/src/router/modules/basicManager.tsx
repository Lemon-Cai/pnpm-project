// import { lazy } from 'react'
import { lazy } from '@loadable/component'

import { LazyLoad } from '@/components/LazyLoad'
import { RouteObject } from '../types'

const LayoutGuard = lazy(() => import('@/layout'))

const Dashboard = LazyLoad(lazy(() => import('@/pages/BasicManager/Dashboard')))

const Loading = LazyLoad(lazy(() => import('@/pages/BasicManager/Components/Loading')))
const Table = LazyLoad(lazy(() => import('@/pages/BasicManager/Components/Table')))

const routeList: RouteObject[] = [
  {
    path: '/basicManager',
    element: <LayoutGuard />,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          key: 'basicManager_dashboard'
        },
        element: Dashboard
      },
      {
        path: 'components',
        name: '基础组件',
        meta: {
          title: '基础组件',
          key: 'basicManager_components'
        },
        children: [
          {
            name: 'Loading',
            path: 'loading',
            meta: {
              title: 'Loading',
              key: 'basicManager_components_loading'
            },
            element: Loading
          },
          {
            name: 'Table',
            path: 'table',
            meta: {
              title: 'Table',
              key: 'basicManager_components_table'
            },
            element: Table
          }
        ]
      }
    ]
  }
]
export default routeList
