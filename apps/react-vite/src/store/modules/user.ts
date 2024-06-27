/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description:
 */
import { create } from 'zustand'

import { getStore, setCookie, setStore } from '@/utils/store'
import http from '@/api'

type State = {
  userInfo: { [key: string]: any } | undefined | null
  accessToken: string
  isInitialized: boolean
}

type Actions = {
  logout?: (action: Action) => void
  // getData?: (query: string) => void
  requestLogin: (query: any) => Promise<any>
  initializeUserInfo: () => void
  loginByUserInfo: () => void
}

type Action = {
  type: keyof Actions
  // query?: string
}

const useUserStore = create<State & Actions>()((set) => {
  // const userInfo = (async function () {
  //   return await getStore('userInfo')
  // })()

  const state: State & Actions = {
    userInfo: null, // localForage.getItem(`${STORE_PREFIX}userInfo`),
    accessToken: '',
    isInitialized: false,
    // dispatch: (action: Action) => set((state) => LoginReducer(state, action)),
    logout: () => {
      set({ userInfo: null, accessToken: '' })
    },

    // 登录请求接口
    requestLogin: async (params: { username: string; password: string }) => {
      let response = await http.post<any>('/api/login', params)
      console.log(response)
      if (response.success) {
        setCookie(void 0, response?.data!.accessToken || '', {})
        setStore('userInfo', response?.data)
      }
    },
    loginByUserInfo: () => {
      // 根据用户信息登录
    },

    initializeUserInfo: async () => {
      try {
        // let response = await http.post<any>('/api/login', { username: 'admin', password: '123456' })
        // console.log('response', response);
        // if (response.success) {
        //   setCookie(void 0, response?.data!.accessToken || '', {})
        // }
        const userInfo = await getStore('userInfo')
        if (userInfo) {
          set({ userInfo, isInitialized: true })
        } else {
          set({ isInitialized: true, userInfo: { name: 'admin' } })
        }
      } catch (error) {
        console.error('Failed to load user info from localForage:', error)
        set({ isInitialized: true })
      }
    }

    // 测试代码
    // getData: async (query: string) => {
    //   set({ status: 'Loading', data: [] })
    //   console.log('get', get())
    //   const res = await fetch(`https://api.github.com/search/repositories?q=${query}`)
    //   const data = await res.json()

    //   set({ status: 'Success', data: data.items })
    //   // set((state) => LoginReducer(state, action))
    //   console.log('get', get())
    // }
  }

  // Initialize the user info
  state.initializeUserInfo()

  return state
})

export default useUserStore
