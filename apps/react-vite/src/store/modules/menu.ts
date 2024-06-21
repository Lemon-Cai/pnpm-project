/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description: 
 */
// import http from '@/api'
import { getAllStore } from '@/utils/store'
import { create } from 'zustand'

type State = {
  isLoading: boolean
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
  getMenus: (params?: any) => Promise<any>,
  init: () => void
}

const useMenuStore = create<State & Actions>((set) => {
  const init = async () => {
    try {

      // let menus = await http.get('/mock/getAllMenu')

      // console.log('menus', menus);

      let storeData = await getAllStore()

      set({
        activeTopMenu: storeData?.activeTopMenu || {},
        activeMenu: storeData?.activeMenu || {},
        topMenuList: storeData?.topMenuList || [],
      })
    } catch (error) {
      console.log(error);
    }
  }

  init()

  return {
    isLoading: true,
    topMenuList: [],
    currentMenuList: [],
    flattenMenuList: [],
    activeTopMenu: {},
    activeMenu: {},
    getMenus: async () => {
      // 这里请求数据
  
      // set((state) => ({ count: state.count + 1 }))
    },
    init
  }
})

export default useMenuStore