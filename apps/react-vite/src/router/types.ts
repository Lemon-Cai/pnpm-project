// import { ReactNode } from 'react'
import type { RouteObject as ReactRouteObject } from 'react-router-dom'

export interface MetaProps {
  title: string
  key: string
  icon?: string
  /**
   * @description 是否固定
   */
  isAffix?: boolean
  /**
   * @description 是否显示iocn
   */
  showIcon?: boolean,
  /**
   * @description 是否全屏展示
   */
  isFull?: boolean,
  /**
   * @description 是否缓存
   */
  keepalive?: boolean

  isLink?: boolean
}

export type RouteObject = {
  name?: string
  fullPath?: string
  children?: RouteObject[]
  meta?: MetaProps
  // 以下本来就有的属性，直接从 ReactRouteObject继承
  // id?: string
  // loader?: LoaderFunction
  // path?: string
  // index?: boolean
  // element?: ReactNode | null;
  // errorElement?: React.ReactNode | null;
  // Component?: React.ComponentType | null;
} & ReactRouteObject

// 有问题
// export interface RouteObject extends ReactRouteObject {
//   // id?: string
//   name?: string
//   // loader?: LoaderFunction
//   // path?: string
//   fullPath?: string
//   // children?: RouteObject[]
//   // index?: boolean
//   meta?: MetaProps
//   // element?: ReactNode | null;
//   // errorElement?: React.ReactNode | null;
//   // Component?: React.ComponentType | null;
// }

export enum ExceptionEnum {
  // page not access
  PAGE_NOT_ACCESS = 403,

  // page not found
  PAGE_NOT_FOUND = 404,

  // server error
  SERVER_ERROR = 500
}