/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description:
 */
import { create } from 'zustand'
import http from '@/api'
import { redirect } from 'react-router-dom'
import { flatTree } from '@/utils'
import { getAllStore } from '@/utils/store'
import { MenuObject } from '@/types/menu'

type State = {
  isInitialized: boolean
  // 一级菜单
  topMenuList: any[]
  // 当前一级菜单下的所有子菜单
  currentMenuList: any[]
  // 把所有菜单平铺
  flattenMenuList: any[]
  // 当前选中的一级菜单
  activeTopMenu: { [key: string]: any } // default active top menu
  // 当前菜单
  activeMenu: { [key: string]: any } // default active menu
}

type Actions = {
  getAllMenus: (params?: any) => Promise<any>
  init: () => void
}

type MenuItem = {
  id: string
  /**
   * @description 菜单名称
   */
  name: string
  /**
   * @description 菜单url
   */
  path: string

  /**
   * @description 菜单文件路径
   */
  filePath: string
  /**
   * @description 子菜单
   */
  children: MenuItem[]
  meta: { [key: string]: any }
  component: string
}

// eslint-disable-next-line
// @ts-ignore
function format(list: MenuObject[] = [], parentPath, level = 0): MenuItem[] {
  let menuLevel = ++level
  return list.map((item: MenuObject) => {
    const path = item.path ? (item.path.startsWith('/') ? item.path : '/' + item.path) : '' // ? `${parentPath}${item.path.startsWith('/') ? item.path : '/' + item.path}` : '' // 避免 item.path 为空， 出现 //xxx 现象
    const children = format(item.children || [], '', menuLevel)
    const hasChild: boolean = children.length > 0
    return {
      id: item.id,
      name: item.name,

      meta: {
        // ...(item.meta || {}),
        menuId: item.id, // 菜单id
        showIcon: item.icon && menuLevel === 2,
        title: item.name, // 页面标题
        icon: item.icon ? item.icon.split('iconfont ')[1] : '' // TODO: 菜单icon
        // keepAlive: KeepAlivePath.includes(path),
        // isFull: item.isOpen == 2 // 全屏
      },
      path: path,
      component: hasChild ? 'Layout' : item.filePath,
      filePath: hasChild ? 'Layout' : item.filePath,
      children: children
    }
  })
}

const useMenuStore = create<State & Actions>((set) => {
  const init = async () => {
    try {
      let storeData = await getAllStore()

      set({
        activeTopMenu: storeData?.activeTopMenu || {},
        activeMenu: storeData?.activeMenu || {},
        topMenuList: storeData?.topMenuList || []
      })
    } catch (error) {
      console.log(error)
      redirect('/500')
    }
  }

  init()

  return {
    isInitialized: false,
    topMenuList: [],
    currentMenuList: [],
    flattenMenuList: [],
    activeTopMenu: {},
    activeMenu: {},
    getAllMenus: async () => {
      try {
        // 这里请求数据
        let response = await http.get<MenuObject[]>('/api/getAllMenus')
        console.log('menus', response)

        if (response.success) {
          let { data = [] } = response
          let menus = format(data, '', 0)

          set({
            isInitialized: true,
            activeTopMenu: {},
            activeMenu: {},
            currentMenuList: [],
            topMenuList: menus,
            flattenMenuList: flatTree(menus, 'children')
          })
        } else {
          // 提示请求失败信息
        }
      } catch (error) {
        console.log('/api/getAllMenus error', error)
      }
    },
    init
  }
})

export default useMenuStore
