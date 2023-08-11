import { lazy, Suspense } from 'react'
import {
  // createHashRouter,
  // RouterProvider,
  Routes,
  Route,
  HashRouter,
} from 'react-router-dom'
// import { Spin } from 'antd'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const ErrorPage = lazy(() => import('./pages/ErrorPage'))
// export const routes = createHashRouter([
//   {
//     path: '/',
//     element: (
//       <Suspense>
//         <Home />
//       </Suspense>
//     ),
//     errorElement: <ErrorPage />, // 如果出错展示哪个 Component
//   },
//   {
//     path: '/login',
//     element: (
//       <Suspense>
//         <Login />
//       </Suspense>
//     ),
//   },
// ])

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Suspense>
              <Home />
            </Suspense>
          }
        >
          <Route
            path='*'
            element={
              <Suspense>
                <ErrorPage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path='/login'
          element={
            <Suspense>
              <Login />
            </Suspense>
          }
        />
      </Routes>
    </HashRouter>
  )
  // return <RouterProvider router={routes} fallbackElement={<Spin />}/>
}
