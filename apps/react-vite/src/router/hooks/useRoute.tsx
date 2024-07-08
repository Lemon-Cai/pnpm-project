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

const resolveAlias = (path: string) => {
  return path.replace('@', '/src');  // 将路径别名替换为实际路径
};

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
        routerItem.element = <LayoutGuard />
      }
      let Component = metaRoutes[resolveAlias(`@${item.filePath}.tsx`)]?.default
      routerItem.children = [
        {
          name: id || nanoid(),
          path: path,
          element: <Component />
        }
      ] as RouteObject[]
      res.push(routerItem)
      continue
    }
    if (component && component !== 'Layout') {
      // 
      let Component = metaRoutes[resolveAlias(`@${item.filePath}.tsx`)]?.default
      routerItem.element = <Component />
    } else {
      if (item.meta?.isFull) {
        // let Component = lazy(metaRoutes[resolveAlias(`@${item.filePath}.tsx`)])
        let Component = metaRoutes[resolveAlias(`@${item.filePath}.tsx`)]?.default
        routerItem.element = <Component />
      } else {
        routerItem.element = <LayoutGuard />
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
  const [state, setState] = useState(() => {
    return {routes: [...routeList], loaded: false, list: []}
  })
  const topMenuList = useMenuStore(state => state.topMenuList)

  useEffect(() => {
    // 
    if (topMenuList.length > 0 && !state.loaded) {
      // debugger
      console.log('topMenuList = ', topMenuList, metaRoutes);
      setState(prevState => ({
        ...prevState,
        routes: [...prevState.routes, ...transformRoutes(getAppsMenu(topMenuList))],
        loaded: true
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topMenuList])


  return state.routes
}

export default useRoutes