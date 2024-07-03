/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description:
 */
import { create } from 'zustand'
import { redirect } from 'react-router-dom'
import http from '@/api'
import { flatTree } from '@/utils'
import { getAllStore, setStore } from '@/utils/store'
import type { MenuObject } from '@/types/menu'
import type { MenuItem } from '@/store/types'

type State = {
  isInitialized: boolean
  // 一级菜单
  topMenuList: MenuItem[]
  // 当前一级菜单下的所有子菜单
  currentMenuList: any[]
  // 把所有菜单平铺
  flattenMenuList: any[]
  // 当前选中的一级菜单
  activeTopMenu: MenuItem | void // default active top menu
  // 当前菜单
  activeMenu: { [key: string]: any } // default active menu
}

type Actions = {
  getAllMenus: (params?: any) => Promise<any>
  init: () => void
  updateTopMenu: (topMenu: MenuItem) => void
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
        key: item.id, // 菜单id
        title: item.name, // 页面标题
        showIcon: !!item.icon && menuLevel > 1,
        icon: item.icon ? item.icon.split('iconfont ')[1] || '' : '' // TODO: 菜单icon, 不一定以 iconfont 开头
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
        activeTopMenu: storeData?.activeTopMenu,
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
    activeTopMenu: undefined,
    activeMenu: {},
    updateTopMenu: (topMenu) => {
      // 缓存
      setStore('activeTopMenu', topMenu)
      // 刷新
      set(state => ({
        ...state,
        activeTopMenu: topMenu,
        currentMenuList: topMenu.children
      }))
    },
    getAllMenus: async () => {
      try {
        // 这里请求数据
        let response = await http.get<MenuObject[]>('/api/getAllMenus')
        console.log('menus', response)

        if (response.success) {
          let { data = [] } = response
          if (data.length > 0) {
            let menus = format(data, '', 0)

            set((state) => {
              let activeTopMenu: MenuItem | void  = menus[0]  // 选中第一个
              if (state.activeTopMenu) {
                // 判断缓存中是否存在选中的一级菜单
                activeTopMenu = menus.find((menu) => menu.id === state.activeTopMenu?.id) 
              }
              let currentMenuList: MenuItem[]  = activeTopMenu!.children || []  // 选中第一个

              return {
                ...state,
                isInitialized: true,
                activeTopMenu: activeTopMenu,
                // activeMenu: {},
                currentMenuList: currentMenuList,
                topMenuList: menus,
                flattenMenuList: flatTree(menus, 'children')
              }
            })
          }
          
        } else {
          // 提示请求失败信息
        }
      } catch (error) {
        set((state) => {
          return {...state, isInitialized: true,}
        })
        console.log('/api/getAllMenus error', error)
      }
    },
    init
  }
})

export default useMenuStore
