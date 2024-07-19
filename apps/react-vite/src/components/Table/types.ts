import type { TableProps } from 'antd'

export type StyledTableProps = {
  $pagination?: TableProps<any>['pagination'] | boolean
  $hasFooter?: boolean
}