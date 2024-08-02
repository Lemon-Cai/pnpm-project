/*
 * @Author: CP
 * @Date: 2024-07-16 15:51:18
 * @Description:
 */
import { useId, useState, useMemo /* useEffect */ } from 'react'
import { Table, TableProps, TablePaginationConfig } from 'antd'
import { useDeepCompareEffect } from 'ahooks'
import { Provider } from './Store/Provider'

import { StyledTableContainer, StyledTable } from './Styled'
import type { TableConfig } from './types'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const TableRender: React.FC<TableConfig> = (props) => {
  const {
    rowKey = 'id', // 默认为 id
    columns,
    data = [], // 表格数据
    // loading,
    fit,
    immediate,
    apiFn,
    transformFn // 转换函数
  } = props

  const id = useId()

  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<any>([])
  const [tableLayout] = useState<TableProps<any>['tableLayout']>('fixed')

  // const [state, s

  const [pagination, setPagination] = useState<
    Pick<TablePaginationConfig, 'current' | 'pageSize' | 'total'>
  >(() => {
    return {
      pageSize: 50, // 每页条数
      current: 1, // 当前页数
      total: 0
    }
  })

  // 作为参数，用于请求数据， 下面的监听也应该是参数的变化
  const paginationParams = useMemo(() => {
    return {
      size: pagination.pageSize ?? 10,
      current: pagination.current ?? 1
    }
  }, [pagination])

  useDeepCompareEffect(() => {
    if (immediate && data.length === 0) {
      // 只有当传入的data为空，且立即请求 = true时才调用
      _getData()
    }
    // eslint-disable-next-line
  }, [JSON.stringify(paginationParams)]) // 触发重新请求， 分页，排序、 筛选

  const handlePaginationChange: TablePaginationConfig['onChange'] = (page, pageSize) => {
    setPagination((prevState) => ({
      ...prevState,
      current: page,
      pageSize
    }))
  }

  // const handlePaginationSizeChange = (current, size) => {}

  const paginationConfig: TablePaginationConfig | false = useMemo(() => {
    if (typeof props.pagination === 'boolean' && !props.pagination) {
      return false
    }
    // 如果 pagination = true 置为空对象
    let config =
      typeof props.pagination === 'boolean' && props.pagination ? {} : props.pagination || {}
    return {
      size: 'default',
      onChange: handlePaginationChange,
      // onShowSizeChange: handlePaginationSizeChange,

      defaultPageSize: pagination.pageSize, // (props.pagination?.pageSizeOptions || PAGE_SIZE_OPTIONS).slice(-1),
      showTotal: (total: number, range: [number, number]) =>
        `显示${range[0]}到${range[1]}, 共${total}条记录`,

      ...pagination,
      ...config,
      pageSizeOptions: config?.pageSizeOptions || PAGE_SIZE_OPTIONS
      //
    } as TablePaginationConfig
  }, [props, pagination])

  const queryParams = useMemo(() => {
    return {}
  }, [])

  const _getData = async () => {
    const params = {
      ...queryParams,
      ...paginationParams
    }
    setLoading(true)
    try {
      let res = await apiFn?.(params)

      if (res?.success) {
        // 数据处理
        if (typeof transformFn === 'function') {
          res = transformFn?.(res)
        }

        setTableData(res?.data?.records || [])
        setPagination((prevState) => ({ ...prevState, total: res?.data?.total ?? 0 }))
      }
    } catch (error) {
      console.error('table fetch data error: ', error)
      setLoading(false)
    }
  }

  const scroll = useMemo(() => {
    if (!fit) {
      return undefined
    }
    return {
      scrollToFirstRowOnChange: true, // 当分页、排序、筛选变化后是否滚动到表格顶部
      y: '100%' // 表格内容区域高度
    }
  }, [fit])

  return (
    <StyledTable
      id={id}
      className="table-wrapper"
      $pagination={paginationConfig && tableData.length > 0}
      $hasFooter={!!props.footer}
    >
      <Table
        bordered
        className="table-content"
        loading={{
          spinning: loading,
          wrapperClassName: 'table-loading'
        }}
        dataSource={tableData}
        scroll={scroll}
        tableLayout={tableLayout}
        rowKey={rowKey}
        {...props}
        pagination={paginationConfig}
        columns={columns}
      />
    </StyledTable>
  )
}

const ProTable = <T extends Record<string, any>>(props: TableConfig<T>) => {
  return (
    <Provider>
      <StyledTableContainer>
        {/* 表单 */}
        {/* 工具栏 */}
        {/* 表格 */}
        <TableRender {...props} />
      </StyledTableContainer>
    </Provider>
  )
}

export default ProTable
