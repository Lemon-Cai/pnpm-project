import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Layout, Dropdown, Avatar, Badge, Space } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, BellOutlined } from '@ant-design/icons'

import Search from './Search'

const LayoutHead = styled(Layout.Header)`
  padding: 0;
  background: #fff;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 1px;
    background: #e5e6eb;
  }
`

const Root = styled.div`
  display: flex;
  justify-content: end;
  // align-items: center;
  padding: 0 18px;
`
const Head = () => {
  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 'setting',
        label: '设置'
      },
      {
        key: 'profile',
        label: '个人信息'
      },
      {
        type: 'divider'
      },
      {
        key: 'logout',
        label: '退出登录'
      }
    ]
  }, [])

  const _doLogout = () => {}

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      _doLogout()
    }
  }

  return (
    <LayoutHead>
      <Root>
        <Space align="center" size={12}>
          <Search />
          <Badge count={5} size="small">
            <Avatar size={34} icon={<BellOutlined />} />
          </Badge>

          <Dropdown menu={{ items, selectable: true, onClick: handleMenuClick }}>
            <Space align="center">
              <Avatar size={34} icon={<UserOutlined />} />
              <span>admin</span>
            </Space>
          </Dropdown>
        </Space>
      </Root>
    </LayoutHead>
  )
}

export default Head
