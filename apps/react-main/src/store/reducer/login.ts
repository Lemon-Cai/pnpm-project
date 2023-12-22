/*
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description:
 */
import { create } from 'zustand'
import { getStore } from '@/utils/store'
import http from '@/api'

type State = {
  userInfo: Object | undefined | null
  accessToken: String
}

type Actions = {
  logout?: (action: Action) => void
  // getData?: (query: string) => void
  requestLogin: (query: any) => void
}

type Action = {
  type: keyof Actions
  // query?: string
}

// const _getData = async (state: State, action: Action) => {
//   const res = await fetch(`https://api.github.com/search/repositories?q=${action.query}`)
//   const data = await res.json()
//   return { status: 'Success', data: data.items }
// }

// const LoginReducer = (state: State, action: Action) => {
//   console.log('state===', state)

//   switch (action.type) {
//     case 'logout': {
//       return state
//     }
//     case 'getData': {
//       let data = _getData(state, action)

//       console.log('data===', data);
//       // 内部会自己处理 merge， 所以不用 ...state,
//       return {
//         ...state,
//         ...data,
//       }
//       // return {...data}
//     }
//     default:
//       return state
//   }
// }
// localForage.getItem('userInfo').then(res => {
//   console.log(res);
// })
// console.log('userInfo', userInfo, getAllStore());

export const useLogin = create<State & Actions>((set, get) => {
  // const userInfo = (async function () {
  //   return await getStore('userInfo')
  // })()

  return {
    userInfo: null, // localForage.getItem(`${STORE_PREFIX}userInfo`),
    accessToken: '',

    // dispatch: (action: Action) => set((state) => LoginReducer(state, action)),
    logout: () => set({ userInfo: null, accessToken: '' }),

    // 登录请求接口
    requestLogin: async (params) => {
      let response = await http.post('/mock/login', params)
      console.log(response);

    },
    loginByUserInfo: () => {
      // 根据用户信息登录
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
})

// 初始化， userInfo，返回的是 promise，暂无方法解决
export async function initializeApp() {
  try {
    // 从 localForage 获取 userInfo
    const userInfo = await getStore('userInfo')

    // 使用 zustand 设置 userInfo
    useLogin.setState?.({ userInfo })
  } catch (error) {
    console.error('Error initializing app:', error)
  }
}

// 在应用启动时调用初始化函数
// initializeApp();
