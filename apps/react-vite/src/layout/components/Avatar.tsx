/*
 * @Author: CP
 * @Date: 2024-06-20 17:21:55
 * @Description: 
 */
import { Dropdown, Avatar as AntdAvatar, MenuProps } from 'antd'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { HOME_URL, LOGIN_URL } from '@/config/constants'

import avatar from '@/assets/images/layout/avatar.png'
import { useNavigate } from 'react-router-dom'
import { useMenuStore, useUserStore } from '@/store'

const StyledRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex: 1;
`

const Avatar = () => {
  const navigate = useNavigate()

  const userStore = useUserStore()
  const menuStore = useMenuStore()

  const handleLogout = useCallback(() => {
    // 清空菜单
    menuStore.initStore()
    // 推出登录
    userStore.logout()
    // 跳转到登录页
    navigate(LOGIN_URL)
    // eslint-disable-next-line
  }, [])

  // Dropdown Menu
  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: '1',
        label: <span className="dropdown-item">首页</span>,
        onClick: () => navigate(HOME_URL)
      },
      {
        key: '2',
        label: <span className="dropdown-item">个人信息</span>
        // onClick: () => infoRef.current!.showModal({ name: 11 })
      },
      {
        key: '3',
        label: <span className="dropdown-item">修改密码</span>
        // onClick: () => passRef.current!.showModal({ name: 11 })
      },
      {
        type: 'divider'
      },
      {
        key: '4',
        label: <span className="dropdown-item">退出登录</span>,
        onClick: handleLogout
      }
    ]
  }, [handleLogout, navigate])

  return (
    <StyledRoot>
      <span>管理员</span>
      <Dropdown menu={{ items }} placement="bottom" arrow trigger={['click']}>
        <AntdAvatar size="large" src={avatar} />
      </Dropdown>
    </StyledRoot>
  )
}

export default Avatar
