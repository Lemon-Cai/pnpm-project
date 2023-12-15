import type { MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number]

export type MyMenuItem = MenuItem & {
  element?: React.ReactNode | null
  errorElement?: React.ReactNode | null
  children?: MyMenuItem[] | null
  path?: string | null
  index?: boolean
}

export type RouteObject = {}

// url类型 iframe | page
export enum UrlType {
  iframe,
  page
}

// 接口返回的数据
export type MenuObject = {
  id: string
  name: string
  parentId: string
  level: number
  path: string
  icon: string
  type: "iframe" | "page"
  children?: MenuObject[] | null
}
