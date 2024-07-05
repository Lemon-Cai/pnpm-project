/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description: 
 */
import { MenuItem } from "@/store/types"
import { RouteObject } from "./types"

/**
 * 获取所有top menu下的应用菜单
 * @param menu
 */
export const getAppsMenu = (menu: MenuItem[]): MenuItem[] => {
  return menu.map((item: MenuItem) => item.children || []).flat()
}


export function genFullPath(routes: RouteObject[], parentPath = '') {
  for (let index = 0; index < routes.length; index++) {
    const route = routes[index]

    if (route.path!.startsWith('/')) {
      route.fullPath = route.path
    } else {
      route.fullPath = `${parentPath}/${route.path}`
    }

    if (route?.children?.length) {
      genFullPath(route.children, route.fullPath)
    }
  }
}
