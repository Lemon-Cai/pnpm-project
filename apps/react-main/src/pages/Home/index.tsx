import React, { useEffect, useState, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import styled from 'styled-components'
import AppRoutes, { menuItems } from '../../router'

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

const Home: React.FC = () => {
  const history = useNavigate()
  const [currentMenuKey, setCurrentMenuKey] = useState(DEFAULT_KEY)
  // 校验

  useEffect(() => {}, [])

  const handleMenuClick = ({ key }: { key: string }) => {
    setCurrentMenuKey(key)
    history(key)
  }

  const handleGoHome = () => {
    // 清空选中的 menuKey
    setCurrentMenuKey(DEFAULT_KEY)
  }

  return (
    <Layout id='root-layout'>
      {/* 菜单 */}
      <Layout.Sider width={240} theme='light'>
        <LogoLink onClick={handleGoHome} />
        <Menu
          mode='inline'
          items={menuItems}
          onClick={handleMenuClick}
          selectedKeys={[currentMenuKey]}
          // theme={theme === 'default' ? 'light' : 'dark'}
        ></Menu>
      </Layout.Sider>
      <Layout id='root-content'>
        {/* header */}
        <Layout.Header>

        </Layout.Header>
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
