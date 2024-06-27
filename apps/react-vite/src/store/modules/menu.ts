/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description: 
 */
import { create } from 'zustand'
import { getAllStore } from '@/utils/store'
import http from '@/api'
import { redirect } from 'react-router-dom'

type State = {
  isInitialized: boolean
  // 一级菜单
  topMenuList: any[]
  // 当前一级菜单下的所有子菜单
  currentMenuList: any[]
  // 把所有菜单平铺
  flattenMenuList: any[],
  // 当前选中的一级菜单
  activeTopMenu: { [key: string]: any }, // default active top menu
  // 当前菜单
  activeMenu: { [key: string]: any }, // default active menu
}

type Actions = {
  getAllMenus: (params?: any) => Promise<any>,
  init: () => void
}

const useMenuStore = create<State & Actions>((set) => {
  const init = async () => {
    try {

      let storeData = await getAllStore()

      set({
        activeTopMenu: storeData?.activeTopMenu || {},
        activeMenu: storeData?.activeMenu || {},
        topMenuList: storeData?.topMenuList || [],
      })
    } catch (error) {
      console.log(error);
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
        let response = await http.get<any>('/api/getAllMenus')
        console.log('menus', response);

        if (response.success) {
          let { data = [] } = response

          set({
            isInitialized: true,
            activeTopMenu: {},
            activeMenu: {},
            topMenuList: [...data],
          })
        } else {
          // 提示请求失败信息
        }
      } catch (error) {
        console.log('/api/getAllMenus error', error);
      }
    },
    init
  }
})

export default useMenuStore