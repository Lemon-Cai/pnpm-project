/*
 * @Author: CP
 * @Date: 2024-06-27 15:49:23
 * @Description: 
 */
/*
 * @Author: CP
 * @Date: 2024-06-17 15:38:29
 * @Description:
 */
import { lazy, /* useEffect */ } from 'react'
import { Navigate, /* useRoutes as useReactRoutes,  RouterProvider,, */  createHashRouter, redirect } from 'react-router-dom'

// import { HomeOutlined } from '@ant-design/icons'
// import * as Sentry from '@sentry/react'

import { RouteObject, ExceptionEnum } from './types'
import { getToken } from '@/utils/store'
import { HOME_URL, LOGIN_URL } from '@/config/constants'
import { genFullPath } from './utils'

const LayoutGuard = lazy(() => import('@/layout'))
// 报错显示的页面
const ErrorBoundary = lazy(() => import('@/components/ErrorBoundary'))


const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const NotFound = lazy(() => import('@/pages/ErrorPage/404'))
const Exception = lazy(() => import('@/pages/ErrorPage/500'))

const metaRoutes = import.meta.glob('./modules/*.tsx', { eager: true }) as Recordable

export const routes: RouteObject[] = []

Object.keys(metaRoutes).forEach(key => {
  const module = metaRoutes[key].default || {}
  const moduleList = Array.isArray(module) ? [...module] : [module]
  genFullPath(moduleList)
  routes.push(...moduleList)
})

export const routeList: RouteObject[] = [
  {
    path: '/',
    name: 'Root',
    element: <LayoutGuard />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to={HOME_URL} />,
      },
      {
        path: HOME_URL.slice(1), // '/home' 去掉 /
        name: 'Home',
        element: <Home />,
        meta: {
          title: '首页',
          key: 'home_000',
          icon: 'home',
          isAffix: true
          // orderNo: 1,
          // hideChildrenInMenu: true
        },
      },
      // ... 其他路由放在这里，如果不是全屏路由
    ]
  },
  {
    path: LOGIN_URL,
    name: 'Login',
    meta: {
      title: '登录页',
      key: 'login'
    },
    loader: () => {
      if (getToken()) {
        // 存在token 跳转到首页
        return redirect('/')
      }
      return null
    },
    element: <Login />
  },

  ...routes,

  {
    path: '*',
    name: 'RedirectTo',
    element: <Navigate to="/404" />
  },
  // {
  //   path: '/403',
  //   name: 'PageNotAuth',
  //   loader: () => ({ status: ExceptionEnum.PAGE_NOT_ACCESS, withCard: false }),
  //   element: <PageException />
  // },
  {
    path: '/404',
    name: 'PageNotFound',
    loader: () => ({ status: ExceptionEnum.PAGE_NOT_FOUND, withCard: false }),
    element: <NotFound />
  },
  {
    path: '/500',
    name: 'PageException',
    loader: () => ({ status: ExceptionEnum.SERVER_ERROR, withCard: false }),
    element: <Exception />
  },
]


export default createHashRouter(routeList)

// export default () => {
//   return useReactRoutes(routeList)
// }

// Sentry.wrapCreateBrowserRouter
// const sentryUseRouter = Sentry.wrapUseRoutes(useRoutes)

// export default sentryUseRouter(routeList)

// let loadedInitFlag = false

// const AppRoutes =  () => {

//   useEffect(() => {
//     init()
//   }, [])

//   const init = async () => {
//     console.log('initDynamicRouter', metaRoutes)
//     await initDynamicRouter()

//     loadedInitFlag = true
//   }

//   if (!loadedInitFlag) return null

//   return sentryUseRouter(routeList)
// }

// export default AppRoutes
