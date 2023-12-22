import { lazy, Suspense } from 'react'
import {
  createHashRouter,
  RouterProvider,
  // Routes,
  // Route,
  // HashRouter,
} from 'react-router-dom'
import { Spin } from 'antd'
import { initializeApp } from './store/reducer/login'



const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const ErrorPage = lazy(() => import('./pages/ErrorPage'))


export const routes = createHashRouter([
  {
    path: '/',
    element: (
      <Suspense>
        <Home />
      </Suspense>
    ),
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
