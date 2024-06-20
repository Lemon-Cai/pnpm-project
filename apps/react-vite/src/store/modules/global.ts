/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description: 
 */
import { create } from 'zustand'
import { Layout } from '../types'

type Store = {
  layout: Layout, // 布局方式 纵向： vertical | 经典： classic | 分栏： columns
  headBackground: boolean
  isCollapse: boolean,
  // 语言
  language: string,
  // 是否显示 tab 栏
  showTabs: boolean
  // 是否显示页脚
  showFooter: boolean
  // 是否显示一级菜单图标
  showTopMenuIcon: boolean

  // 主题
  // 黑色
  isDark: boolean
  // 灰色，或者 色弱模式
  weakOrGray: 'gray' | 'weak' | '' | undefined
}
type Actions = {
  updateState: (params?: any) => void
}

const useGlobalStore = create<Store & Actions>((set) => ({
  layout: 'classic',
  headBackground: true,
  isCollapse: false,
  language: 'zh',
  showTabs: true,
  showFooter: false,
  showTopMenuIcon: false,
  
  isDark: false,
  weakOrGray: undefined,
  updateState: (values = {}) => {
    set((state) => ({ ...state, ...values }))
  }
}))

export default useGlobalStore
