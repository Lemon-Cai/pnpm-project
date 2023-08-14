import type { MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number]

export type MyMenuItem = MenuItem & {
  element?: React.ReactNode | null
  children?: MyMenuItem[] | null
  path?: string | null
}