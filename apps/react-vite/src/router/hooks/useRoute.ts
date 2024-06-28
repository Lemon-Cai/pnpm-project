/*
 * @Author: CP
 * @Date: 2024-06-28 15:48:09
 * @Description: 
 */
import { lazy, useEffect, useState } from "react"
import { nanoid } from "nanoid"

import { useMenuStore } from "@/store"
import type { MenuItem } from "@/store/types"
import type { RouteObject } from '@/router/types'

import { getAppsMenu } from '../utils'
import { routeList } from '../index'

const LayoutGuard = lazy(() => import('@/layout'))

const metaRoutes = import.meta.glob('@/pages/**/*.tsx', { eager: true }) as Recordable


// 把菜单转成路由
export const transformRoutes = (menus: MenuItem[], parentPath = ''): RouteObject[] => {
  const res: RouteObject[] = []

  for (const item of menus) {
    const { path, component, id, /* name, */ children } = item
    const routerItem: RouteObject = {
      id: id || nanoid(), // 保证name必须唯一
      name: id || nanoid(), // 保证name必须唯一
      path: path,
      children: [],
      meta: {
        ...(item.meta || {})
      }
    }
    if (!parentPath && children?.length === 0) {
      // 二级菜单，设一级路由为菜单
      routerItem.path = ''
      if (item.meta?.isFull) {
        // 是否全屏展示   TODO: 暂时不放开
        routerItem.element = ''
      } else {
        routerItem.Component = LayoutGuard
      }
      // routerItem.children = [
      //   {
      //     name: id || nanoid(),
      //     path: path,
      //     // Component: metaRoutes[`.${component}.vue`]
      //   }
      // ]
      res.push(routerItem)
      continue
    }
    if (component && component !== 'Layout') {
      // routerItem.component = metaRoutes[`.${component}.vue`]
    } else {
      // routerItem.component = () => import('../page/index/index.vue');
      if (item.meta?.isFull) {
        // routerItem.component = metaRoutes[`.${component}.vue`]
      } else {
        // routerItem.component = LayoutGuard
      }
    }

    if (children.length > 0) {
      routerItem.children = transformRoutes(children, routerItem.path)
    }

    res.push(routerItem)
  }

  return res
}


const useRoutes = () => {
  const [routes, setRoutes] = useState(() => {
    return [...routeList]
  })
  const topMenuList = useMenuStore(state => state.topMenuList)

  useEffect(() => {
    // 
    if (topMenuList.length > 0) {
      // debugger
      setRoutes(prevState => ([...prevState, ...transformRoutes(getAppsMenu(topMenuList))]))
    }
  }, [topMenuList])

  console.log('topMenuList = ', topMenuList, metaRoutes);

  return routes
}

export default useRoutes