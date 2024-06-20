/*
 * @Author: CP
 * @Date: 2024-06-17 15:38:29
 * @Description:
 */
import { lazy, /* useEffect */ } from 'react'
import { Navigate, /* useRoutes, RouterProvider, */ createHashRouter } from 'react-router-dom'

// import { HomeOutlined } from '@ant-design/icons'
// import * as Sentry from '@sentry/react'

import { RouteObject, ExceptionEnum } from './types'
// import { initDynamicRouter } from './utils'

const LayoutGuard = lazy(() => import('@/layout'))

const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const NotFound = lazy(() => import('@/pages/ErrorPage/404'))

// const metaRoutes = import.meta.glob('./routes/*.tsx', { eager: true }) as Recordable

// const routes: RouteObject[] = []

// Object.keys(metaRoutes).forEach(key => {
//   const module = metaRoutes[key].default || {}
//   const moduleList = Array.isArray(module) ? [...module] : [module]
//   genFullPath(moduleList)
//   routeList.push(...moduleList)
// })

export const routeList: RouteObject[] = [
  {
    path: '/',
    name: 'Root',
    element: <Navigate to="/home" />,
    loader: () => {
      console.log('看看是否走这里');
      return 1
    }
  },
  {
    path: '/home',
    name: 'Home',
    element: <LayoutGuard />,
    meta: {
      title: '首页',
      key: 'home_000',
      icon: 'home',
      isAffix: true
      // orderNo: 1,
      // hideChildrenInMenu: true
    },
    children: [
      {
        path: '',
        name: 'HomePage',
        element: <Home />,
        meta: {
          title: '首页',
          key: 'home_000',
          icon: 'home'
          // orderNo: 1,
          // hideMenu: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录页',
      key: 'login'
    },
    // loader: () => {
    //   if (getAuthCache<string>(TOKEN_KEY)) {
    //     return redirect('/')
    //   }
    //   return null
    // },
    element: <Login />
  },
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
  }
]

export default createHashRouter(routeList)

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
