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
  /**
   * @description 菜单id
   */
  id: string
  /**
   * @description 菜单名称
   */
  name: string 
  /**
   * @description 上一级菜单的id
   */
  parentId: string
  /**
   * @description 当前菜单层级
   */
  level: number
  /**
   * @description 菜单url
   */
  path: string
  /**
   * @description 菜单图标
   */
  icon: string
  /**
   * @description 菜单文件路径
   */
  filePath: string
  /**
   * @description 菜单类型, 默认 page, 可以内嵌为 iframe
   */
  type: "iframe" | "page"
  /**
   * @description 子菜单
   */
  children?: MenuObject[] | null
}
