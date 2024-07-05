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
const PurchaseManageList = LazyLoad(lazy(() => import('@/pages/Erp/PurchaseManage/List')))
const PurchaseManageDetail = LazyLoad(lazy(() => import('@/pages/Erp/PurchaseManage/Detail')))

const StoreManageList = LazyLoad(lazy(() => import('@/pages/Erp/StoreManage/List')))
const StoreManageDetail = LazyLoad(lazy(() => import('@/pages/Erp/StoreManage/Detail')))

const routeList: RouteObject[] = [
  {
    path: '/erp',
    name: 'ERP系统',
    element: <LayoutGuard />,
    children: [
      {
        path: 'purchaseManage',
        name: '采购管理',
        meta: {
          title: '采购管理',
          key: 'erp_purchaseManage'
        },
        children: [
          {
            path: 'list',
            name: '采购列表',
            meta: {
              title: '采购列表',
              key: 'erp_purchaseManage_list'
            },
            element: PurchaseManageList
          },
          {
            path: 'detail',
            name: '采购详情',
            meta: {
              title: '采购详情',
              key: 'erp_purchaseManage_detail'
            },
            element: PurchaseManageDetail
          },
        ]
      },
      {
        path: 'storeManage',
        name: '库存管理',
        meta: {
          title: '库存管理',
          key: 'erp_storeManage'
        },
        // element: <Mapboxgl />,
        children: [
          {
            path: 'list',
            name: '库存列表',
            meta: {
              title: '库存列表',
              key: 'erp_storeManage_list'
            },
            element: StoreManageList
          },
          {
            path: 'detail',
            name: '库存详情',
            meta: {
              title: '库存详情',
              key: 'erp_storeManage_detail'
            },
            element: StoreManageDetail
          }
        ]
      }
    ]
  }
] as RouteObject[]
export default routeList
