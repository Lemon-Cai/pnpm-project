import { create } from 'zustand'
import { Layout } from '../types'

type Store = {
  layout: Layout, // 布局方式 纵向： vertical | 经典： classic | 分栏： columns
  isCollapse: boolean,
  // 语言
  language: string
}
type Actions = {
  updateState: (params?: any) => void
}

const useGlobalStore = create<Store & Actions>((set) => ({
  layout: 'classic',
  isCollapse: false,
  language: 'zh',
  updateState: (values = {}) => {
    set((state) => ({ ...state, ...values }))
  }
}))

export default useGlobalStore
