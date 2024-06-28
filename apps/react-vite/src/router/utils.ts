/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description: 
 */
import { MenuItem } from "@/store/types"

/**
 * 获取所有top menu下的应用菜单
 * @param menu
 */
export const getAppsMenu = (menu: MenuItem[]): MenuItem[] => {
  return menu.map((item: MenuItem) => item.children || []).flat()
}

