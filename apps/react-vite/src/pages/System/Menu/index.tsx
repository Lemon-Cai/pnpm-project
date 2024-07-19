/*
 * @Author: CP
 * @Date: 2024-06-17 15:09:07
 * @Description:
 */
import { useMemo, useState, useEffect, useLayoutEffect, useId } from 'react'
import { Space, Button, Table /* Empty,  Pagination, */ } from 'antd'
import type { TableProps, TableColumnProps, TablePaginationConfig } from 'antd'
import { useDebounceFn } from 'ahooks'
import styled from 'styled-components'

import Page from '@/components/Page'

// import useTable from '@/hooks/useTable'
type StyledTableProps = {
  $pagination?: TablePaginationConfig
  $hasFooter?: boolean
}

const StyledTable = styled.div<StyledTableProps>`
  height: 100%;
  /* display: flex;
  flex-direction: column; */

  .table-content {
    height: 100%;
    /* flex: 1; */

    .table-loading {
      height: 100%;
      .ant-spin-container {
        height: ${(props) => (!!props.$pagination ? 'calc(100% - 64px)' : '100%')};
      }
    }
    .ant-table {
      height: 100%;
      .ant-table-container {
        height: ${(props) => (props.$hasFooter ? 'calc(100% - 60px)' : '100%')};
        display: flex;
        flex-direction: column;
        .ant-table-body {
          flex: 1;
        }
      }
    }
    .ant-empty {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`

export type ApiFn = (args: any) => Promise<Api.ResponseData<Api.PaginatingQueryRecord>>

const fetchData: ApiFn = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        success: true,
        msg: '',
        data: {
          records: [
            {
              id: '1',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '2',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '3',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '4',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '5',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '6',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '7',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '8',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '9',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '10',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '11',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            },
            {
              id: '12',
              menuName: 'dashboard',
              menuIcon: '',
              routeName: '/dashboard'
            }
          ],
          size: 20,
          current: 1,
          total: 100
        }
      })
    })
  })
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const SCROLL = {
  scrollToFirstRowOnChange: true, // 当分页、排序、筛选变化后是否滚动到表格顶部
  y: '100%' // 表格内容区域高度
}

const Menu: React.FC<any> = (props) => {
  // const { columns } = useTable({
  //   apiFn: fetchData,
  //   columns: []
  // })

  const id = useId()

  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<any>([])
  const [tableLayout] = useState<TableProps<any>['tableLayout']>('fixed')

  // const [state, setState] = useState({
  //   fit: true,
  //   height: 0
  // })

  const [pagination, setPagination] = useState({
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pageSize: 50, // 每页条数
    current: 1, // 当前页数
    total: 0
  })

  useEffect(() => {
    // if (immediate) {
    if (true) {
      _getData()
    }
    // eslint-disable-next-line
  }, [])

  useLayoutEffect(() => {
    // dom渲染后同步执行
    // 创建页面resize监听

    window.addEventListener('resize', handleRunResize)

    return () => {
      window.removeEventListener('resize', handleRunResize)
    }
  })

  //
  const handleResize = () => {}
  const { run: handleRunResize } = useDebounceFn(handleResize, {
    wait: 200
  })

  const columns: TableColumnProps<object>[] = useMemo(
    () => [
      {
        key: '_index',
        dataIndex: '',
        title: '',
        align: 'center',
        type: '_index',
        width: 60,
        // eslint-disable-next-line
        // @ts-ignore
        render: (_: any, $: any, index: number) =>
          index + 1 + (pagination.current - 1) * pagination.pageSize
      },
      {
        // key: 'menuName',
        dataIndex: 'menuName',
        title: '菜单名称',
        align: 'center',
        ellipsis: true
      },
      {
        // key: 'menuIcon',
        dataIndex: 'menuIcon',
        title: '菜单图标',
        align: 'center'
      },
      {
        // key: 'routeName',
        dataIndex: 'routeName',
        title: '路由名称',
        align: 'center'
      },
      {
        // key: 'routePath',
        dataIndex: 'routePath',
        title: '路由路径',
        align: 'center'
      },
      {
        // key: 'enableStatus',
        dataIndex: 'enableStatus',
        title: '是否启用',
        align: 'center'
      }
    ],
    [pagination]
  )

  const handlePaginationChange: TablePaginationConfig['onChange'] = (page, pageSize) => {
    // console.log(page, pageSize);
    setPagination((prevState) => ({
      ...prevState,
      current: page,
      pageSize
    }))
  }

  // const handlePaginationSizeChange: TablePaginationConfig['onShowSizeChange'] = (current, size) => {
  //   console.log(current, size);
  //   // 最终会调用onChange
  // }

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

  const _getData = () => {
    const params = {
      ...queryParams,
      pageSize: pagination.pageSize,
      current: pagination.current
    }
    setLoading(true)
    fetchData(params)
      .then((res) => {
        if (res.success) {
          setTableData(res?.data?.records || [])
          setPagination((prevState) => ({ ...prevState, total: res.data.total }))
        }
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Page>
      <Page.Header>
        <Space style={{ float: 'right' }}>
          <Button>新增</Button>
          <Button>批量删除</Button>
        </Space>
      </Page.Header>
      <Page.Content>
        <StyledTable id={id} className="table-wrapper" $pagination={paginationConfig} $hasFooter>
          <Table
            bordered
            className="table-content"
            rowKey="id"
            loading={{
              spinning: loading,
              wrapperClassName: 'table-loading'
            }}
            columns={columns}
            dataSource={tableData}
            scroll={SCROLL}
            pagination={paginationConfig}
            tableLayout={tableLayout}
            footer={() => '这个 footer'}
            // locale={{
            //   emptyText: (
            //     <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            //       <Empty description="暂无数据" />
            //     </div>
            //   )
            // }}
          />
        </StyledTable>
      </Page.Content>
    </Page>
  )
}

export default Menu
