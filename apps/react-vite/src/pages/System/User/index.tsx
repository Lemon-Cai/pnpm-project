/*
 * @Author: CP
 * @Date: 2024-06-17 15:09:07
 * @Description:
 */
import { Button, TableProps, Card } from 'antd'
import Page from '@/components/Page'

import ProTable from '@/components/Table'
import { useMemo } from 'react'



const User = () => {
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
        title: '用户名',
        align: 'center'
        // minWidth: 100
      },
      {
        dataIndex: 'nickName',
        title: '昵称',
        align: 'center'
        // minWidth: 100
      },
      {
        dataIndex: 'phoneNumber',
        title: '手机号',
        align: 'center'
        // width: 120
      },
      {
        dataIndex: 'email',
        title: '邮箱',
        align: 'center'
        // minWidth: 200
      },
      {
        dataIndex: 'status',
        title: '用户状态',
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
          </div>
        )
      }
    ]
  }, [])

  const handleEdit = (id: string) => {
    console.log(id)
  }

  return (
    <Page>
      <Page.Header></Page.Header>
      <Page.Content>
        <Card title="表格">
          <ProTable columns={columns} pagination />
        </Card>
      </Page.Content>
    </Page>
  )
}

export default User
