/*
 * @Author: CP
 * @Date: 2024-07-30 09:51:27
 * @Description: 基础表格： 包含表头拖动功能，表头列设置
 */

import { useMemo } from "react"
import { Table, TableProps, TableColumnsType } from "antd"

import ResizableTitle from "./components/ResizableTitle"

type BasicTableProps<T = Record<PropertyKey, any>, R = Record<PropertyKey, any>> = {
  rowKey?: string
  columns: TableProps<T>['columns'],
  data: Array<R>,
  pagination?: TableProps<R>['pagination']
  components?: TableProps<R>['components']
}

const BasicTable: React.FC<BasicTableProps> = (props) => {
  const {
    rowKey = 'id',
    columns = [],
    data = [],
    pagination,
    components,
    ...restProps
  } = props

  const handleResize = (col: any) => {
    console.log(col)
  }

  const columnsList = useMemo(() => {
    return columns.map((col) => {
      return {
        ...col,
        onHeaderCell: (column: TableColumnsType<Record<PropertyKey, any>>[number]) => ({
          width: column.width,
          onResize: (size: any) => {
            console.log(size)
            handleResize(col)
          },
        }),
      }
    })
  }, [columns])

  const innerComponents = {
    ...components,
    header: {
      ...(components?.header || {}),
      cell: ResizableTitle
    }
  }

  return (
    <Table 
      rowKey={rowKey}
      {...restProps}
      components={innerComponents}
      columns={columnsList}
      dataSource={data}
      pagination={pagination}
    />
  )
}

export default BasicTable