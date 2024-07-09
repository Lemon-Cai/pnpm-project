import { create } from 'zustand'
import { RouteObject } from '@/router/types'

type State = {
  tagList: Array<RouteObject>,
  // 缓存的页面
  keepAliveMap: Map<string, React.JSX.Element>
}

type Actions = {
  addTab: (item: RouteObject) => void
  closeTab: () => void
}

const useTabStore = create<State & Actions>(set => {
  return {
    tagList: [],
    keepAliveMap: new Map(),
    addTab: (item) => {
      set(state => {

        if (item.meta?.keepalive) {
          // TODO: 需要缓存
        }
        
        let exist = state.tagList.find(tag => tag.id === item.id)
        if (exist) {
          return {
            // ...state,
          }
        }
        return {
          ...state,
          tagList: state.tagList.push(item),
        }
      })
    },
    closeTab: () => {}
  }
})

export default useTabStore