import type { TableProps } from 'antd'

export type StyledTableProps = {
  $pagination?: TableProps<any>['pagination'] | boolean
  $hasFooter?: boolean
}

export type ApiFn<T = any, A = Record<string, any> & Api.CommonSearchParams> = (
  args: A
) => Promise<Api.ResponseData<Api.PaginatingQueryRecord<T>>>

export type ApiTransformFn<T, Response> = (data: Response) => Api.ResponseData<Api.PaginatingQueryRecord<T>>

export type TableConfig<T extends Record<string, any> = any> = {
  /**
   * 表格数据
   */
  data?: any[]

  /**
   * 表格列的配置描述
   */
  columns: any[]

  /**
   * 分页器
   */
  pagination?: TableProps<T>['pagination'] | boolean

  /**
   * 是否显示底部
   */
  hasFooter?: boolean

  /**
   * 是否自适应
   */
  fit?: boolean
  /**
   * 是否立即加载
   */
  immediate?: boolean

  /**
   * 数据请求函数
   */
  apiFn?: ApiFn
  /**
   * 数据转换函数，非标准数据格式转成标准数据格式
   */
  transformFn?: ApiTransformFn<T, Awaited<ReturnType<ApiFn>>>
} & Omit<TableProps<T>, 'dataSource' | 'pagination'>
