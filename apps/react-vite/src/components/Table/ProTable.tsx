/*
 * @Author: CP
 * @Date: 2024-07-16 15:51:18
 * @Description:
 */
import { useId, useState, useMemo, /* useEffect */ } from 'react'
import { Table, TableProps, TablePaginationConfig } from 'antd'
import { useDeepCompareEffect } from 'ahooks'
import { Provider } from './Store/Provider'

import { StyledTableContainer, StyledTable } from './Styled'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const TableRender: React.FC<any> = (props) => {
  const {
    rowKey = 'id', // 默认为 id
    columns,
    // loading,
    fit,
    immediate,
    apiFn
  } = props

  const id = useId()

  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<any>([])
  const [tableLayout] = useState<TableProps<any>['tableLayout']>('fixed')

  // const [state, s

  const [pagination, setPagination] = useState<TablePaginationConfig>(() => {
    return {
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      pageSize: 50, // 每页条数
      current: 1, // 当前页数
      total: 0
    }
  })

  useDeepCompareEffect(() => {
    if (immediate) {
      _getData()
    }
    // eslint-disable-next-line
  }, [JSON.stringify(pagination)])

  const handlePaginationChange: TablePaginationConfig['onChange'] = (page, pageSize) => {
    setPagination((prevState) => ({
      ...prevState,
      current: page,
      pageSize
    }))
  }

  // const handlePaginationSizeChange = (current, size) => {}

  const paginationConfig: TablePaginationConfig = useMemo(() => {
    if (typeof props.pagination === 'boolean' && !props.pagination) {
      return props.pagination
    }
    return {
      size: props.paginationSize || 'default',
      onChange: handlePaginationChange,
      // onShowSizeChange: handlePaginationSizeChange,

      defaultPageSize: 50, // (props.pagination?.pageSizeOptions || PAGE_SIZE_OPTIONS).slice(-1),
      showTotal: (total: number, range: [number, number]) =>
        `显示${range[0]}到${range[1]}, 共${total}条记录`,
      ...(props.pagination || {}),
      ...pagination,
      //
      pageSizeOptions: props.pagination?.pageSizeOptions || PAGE_SIZE_OPTIONS
    }
  }, [props, pagination])

  const queryParams = useMemo(() => {
    return {}
  }, [])

  const _getData = async () => {
    const params = {
      ...queryParams,
      pageSize: pagination.pageSize,
      current: pagination.current
    }
    setLoading(true)
    try {
      let res = await apiFn(params)

      if (res.success) {
        setTableData(res?.data?.records || [])
        setPagination((prevState) => ({ ...prevState, total: res.data.total }))
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const scroll = useMemo(() => {
    if (!fit) {
      return null
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
        columns={columns}
        dataSource={tableData}
        scroll={scroll}
        pagination={paginationConfig}
        tableLayout={tableLayout}
        rowKey={rowKey}
        {...props}
      />
    </StyledTable>
  )
}

const ProTable = <T extends Record<string, any>>(props: T) => {
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
