import { lazy, Suspense } from 'react'
import { useRoutes, RouteObject } from 'react-router-dom'

import { HomeOutlined } from '@ant-design/icons'

import { MyMenuItem } from '../types/menu'

// cesium 入门
const Induction = lazy(() => import('../pages/Cesium/Induction'))
// cesium 进阶
const Advance = lazy(() => import('../pages/Cesium/Advance'))
// ThreeJs的使用
// const ThreeJs = lazy(() => import('../pages/ThreeJs'))

const FirstCase = lazy(() => import('../pages/ThreeJs/FirstCase'))
const SecondCase = lazy(() => import('../pages/ThreeJs/SecondCase'))
const ThreeEarth = lazy(() => import('../pages/ThreeJs/Earth'))


function LazyLoad(element: React.ReactNode) {
  return <Suspense fallback={null}>{element}</Suspense>
}

// 菜单列表
export const menuItems: MyMenuItem[] = [
  {
    label: '三维地图入门',
    key: '/cesium/induction', // 正常情况 相当于route中path， 路由的 path 唯一，特殊情况： 子路由配置时 key 得是全路径
    path: '/cesium/induction',
    icon: <HomeOutlined />,
    children: null,
    element: LazyLoad(<Induction />),
  },
  {
    key: '/cesium/advance',
    path: '/cesium/advance',
    label: '三维地图进阶',
    icon: <HomeOutlined />,
    element: LazyLoad(<Advance />),
  },
  {
    key: '/threeJs',
    path: '/threeJs',
    label: 'threeJs',
    icon: <HomeOutlined />,
    // element: LazyLoad(<ThreeJs />),
    children: [
      {
        key: '/threeJs/firstCase',
        path: 'firstCase',
        label: '第一个案例',
        // type: "group",
        element: LazyLoad(<FirstCase />),
      },
      {
        key: '/threeJs/secondCase',
        path: 'secondCase',
        label: '第二个案例',
        // type: "group",
        element: LazyLoad(<SecondCase />),
      },
      {
        key: '/threeJs/earth',
        path: 'earth',
        label: '地球',
        // type: "group",
        element: LazyLoad(<ThreeEarth />),
      },
    ],
  },
]

function generateRoute(menuList: MyMenuItem[], parentPath?: string): RouteObject[] {
  let items = []
  for (const menu of menuList) {
    if (menu.key) {
      // const currentPath = `${
      //   parentPath?.endsWith('/') ? parentPath.slice(0, -1) : parentPath
      // }${(menu.key as string)?.startsWith('/') ? menu.key : '/' + menu.key}`
      items.push({
        path: menu.path,
        // path: currentPath,
        element: menu.element,
        children: Array.isArray(menu.children)
          ? generateRoute(menu.children)
          : null,
      })
    }
  }
  return items as RouteObject[]
}

const routeList = generateRoute(menuItems, '')

// type MyType = {
//   name: string,
//   icon?: React.ReactNode,
// }

// type MyRouteObject = RouteObject & MyType

// type RouteType = MyRouteObject & {
//   children?: MyRouteObject[]
// }

// export const routesArr: RouteObject[] = [
//   {
//     // index: true, // 默认选中的页面
//     path: '/cesium/induction',
//     name: '三维地图入门',
//     icon: <HomeOutlined />,
//     element: LazyLoad(<Induction />),
//   },
//   {
//     path: '/cesium/advance',
//     name: '三维地图进阶',
//     element: LazyLoad(<Advance />),
//     // errorElement: <ErrorBoundary />
//   },
//   {
//     path: '/threeJs',
//     name: 'threeJs',
//     // element: LazyLoad(<ThreeJs />),
//     children: [
//       {
//         path: '/firstCase',
//         name: '第一个案例',
//         element: LazyLoad(<FirstCase />)
//       }
//     ]
//     // errorElement: <ErrorBoundary />
//   },
// ]

// function generateMenus(routesArr: RouteType[]): MenuItem[] {
//   let items = []
//   for (const route of routesArr) {
//     if (route.path) {
//       items.push({
//         key: route.path,
//         icon: route.icon ? route.icon : null,
//         children: Array.isArray(route.children)
//           ? generateMenus(route.children as RouteType[])
//           : null,
//         // label: <Link to={route.path}>{route.name}</Link>,
//         label: route.name,
//         type: Array.isArray(route.children) && route.children.length > 0 ? 'group' : '',
//       })
//     }
//   }

//   return items
// }

// export const menuItems = generateMenus(routesArr)

const AppRoutes = () => {
  return useRoutes(routeList)
  // return (
  //   <Routes>
  //     {routesArr.map(({ path, element, children, ...other }) => (
  //       <Route
  //         key={path}
  //         path={path}
  //         element={<Suspense fallback={null}>{element}</Suspense>}
  //         // {...other}
  //       >

  //       </Route>
  //     ))}
  //   </Routes>
  // )
}

export default AppRoutes
