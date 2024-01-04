/*
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
 */
import { lazy, Suspense } from 'react'
import {
  createHashRouter,
  RouterProvider,
  redirect
  // Routes,
  // Route,
  // HashRouter,
} from 'react-router-dom'
import { Spin } from 'antd'
import { initializeApp } from '@/store/reducer/login'
import { getToken } from '@/utils/store'


const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const ErrorPage = lazy(() => import('./pages/ErrorPage'))


export const routes = createHashRouter([
  {
    path: '/',
    element: <Home />,
    loader: async () => {
      const token = getToken()
      // 如果没有 token返回到 登录页
      if (!token) {
        return redirect('/login')
      }
      return null
    },
    errorElement: <ErrorPage />, // 如果出错展示哪个 Component
  },
  {
    path: '/login',
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '*',
    children: [],
    Component: Home,
    errorElement: <ErrorPage />
  }
])

export default function App() {
  initializeApp()
  // way1:
  // return (
  //   <HashRouter>
  //     <Routes>
  //       <Route
  //         path='/'
  //         element={
  //           <Suspense>
  //             <Home />
  //           </Suspense>
  //         }
  //       >
  //         <Route
  //           path='*'
  //           element={
  //             <Suspense>
  //               <ErrorPage />
  //             </Suspense>
  //           }
  //         />
  //       </Route>
  //       <Route
  //         path='/login'
  //         element={
  //           <Suspense>
  //             <Login />
  //           </Suspense>
  //         }
  //       />
  //     </Routes>
  //   </HashRouter>
  // )
  // way2：
  return <RouterProvider router={routes} fallbackElement={<Spin />}/>
}
