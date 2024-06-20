import { create } from 'zustand'

type Store = {
  count: number
}
type Actions = {
  getMenus: (params?: any) => Promise<any>
}

const useMenuStore = create<Store & Actions>((set) => ({
  count: 1,
  getMenus: async () => {
    // 这里请求数据

    set((state) => ({ count: state.count + 1 }))
  },
}))

export default useMenuStore