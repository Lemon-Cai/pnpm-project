import React, { useEffect, useState, Suspense } from 'react'
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { Layout, Menu } from 'antd'
import styled from 'styled-components'

import AppRoutes, { menuItems } from '@/router'
import { findParentKeyPath } from '@/utils/common'

import Head from './Head'
import Tabs from './Tabs'

const StyledLogo = styled.div`
  padding: 12px 12px 12px 24px;
`

const LogoLink: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Link to={{ pathname: '/' }} onClick={onClick}>
      <StyledLogo>logo</StyledLogo>
    </Link>
  )
}

const DEFAULT_KEY = 'home'

const Home: React.FC = (props) => {
  const history = useNavigate()
  const location = useLocation()

  // 动态路由参数匹配问题， path="route/:type?" 怎么截取type之前的route进行匹配 
  const [currentMenuKey, setCurrentMenuKey] = useState(
    location.pathname !== '/' ? location.pathname.replace(location.search, '') : DEFAULT_KEY
  )
  // 默认展开当前选中的菜单
  const [defaultOpenKeys] = useState(() => {
    return findParentKeyPath(menuItems, currentMenuKey)
  })

  // 校验
  useEffect(() => {
    // console.log('location', location);
    // if (location.pathname !== '/') {
    // }
  }, [])

  const handleMenuClick = ({ key }: { key: string }) => {
    setCurrentMenuKey(key)
    history(key)
  }

  const handleGoHome = () => {
    // 清空选中的 menuKey
    setCurrentMenuKey(DEFAULT_KEY)
  }

  return (
    <Layout hasSider id='root-layout'>
      {/* 菜单 */}
      <Layout.Sider width={240} theme='light'>
        <LogoLink onClick={handleGoHome} />
        <Menu
          mode='inline'
          items={menuItems}
          onClick={handleMenuClick}
          defaultOpenKeys={defaultOpenKeys}
          selectedKeys={[currentMenuKey]}
          // theme={theme === 'default' ? 'light' : 'dark'}
        ></Menu>
      </Layout.Sider>
      <Layout id='root-content'>
        {/* header */}
        <Head />
        {/* Tabs */}
        <Tabs />
        {/* 面包屑 */}

        {/* 内容 */}
        <Layout.Content className='main-container'>
          <Suspense>
            <AppRoutes />
          </Suspense>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Home
