import type { MetaProps } from '@/router/types'

export type Layout = 'classic' | 'vertical' | 'columns'

export enum LayoutEnum {
  classic,
  vertical,
  columns
}


export type MenuItem = {
  id: string
  /**
   * @description 菜单名称
   */
  name: string
  /**
   * @description 菜单url
   */
  path: string
  /**
   * @description 菜单文件路径
   */
  filePath: string
  /**
   * @description 子菜单
   */
  children: MenuItem[]
  meta: MetaProps
  component: string
}