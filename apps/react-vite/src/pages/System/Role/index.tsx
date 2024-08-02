/*
 * @Author: CP
 * @Date: 2024-07-29 15:23:53
 * @Description:
 */
import { useMemo } from 'react'
import { Button, TableProps } from 'antd'
import Page from '@/components/Page'

import ProTable from '@/components/Table'

const Role = () => {
  const columns: TableProps<any>['columns'] = useMemo(() => {
    return [
      {
        type: 'selection',
        align: 'center',
        width: 60
      },
      {
        key: 'index',
        title: '序号',
        align: 'center',
        width: 64
      },
      {
        dataIndex: 'username',
        title: '角色名称',
        align: 'center'
        // minWidth: 100
      },
      {
        dataIndex: 'nickName',
        title: '角色编码',
        align: 'center'
        // minWidth: 100
      },
      {
        dataIndex: 'phoneNumber',
        title: '描述',
        align: 'center'
        // width: 120
      },
      {
        dataIndex: 'status',
        title: '状态',
        align: 'center',
        width: 100
        // render: (_, row) => {
        // }
      },
      {
        // key: 'operate',
        title: '操作',
        align: 'center',
        width: 130,
        render: (_, row) => (
          <div className="flex-center gap-8px">
            <Button type="primary" ghost size="small" onClick={() => handleEdit(row.id)}>
              编辑
            </Button>
            <Button type="primary" danger size="small" onClick={() => handleDelete(row.id)}>
              删除
            </Button>
          </div>
        )
      }
    ]
  }, [])


  const handleEdit = (id: string) => {
    console.log(id)
  }

  const handleDelete = (id: string) => {
    console.log(id)
  }

  return (
    <Page>
      <Page.Content>
        <ProTable columns={columns} pagination />
      </Page.Content>
    </Page>
  )
}

export default Role
