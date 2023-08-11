
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import styled from 'styled-components'
import AppRoutes, { menuItems } from '../../router'


const StyledLogo = styled.div`
  padding: 12px 12px 12px 24px;
`

const LogoLink = () => {
  return (
    <Link to={{pathname: '/'}}>
      <StyledLogo>logo</StyledLogo>    
    </Link>
  )
}

const AppLayout: React.FC = () => {
  const history = useNavigate()
  const [currentMenuKey, setCurrentMenuKey] = useState("home")
  // 校验

  useEffect(() => {
    
  }, [])

  const handleMenuClick = ({ key }: { key: string }) => {
    setCurrentMenuKey(key)
    history(key)
  }

  return (
    <Layout id='root-layout'>
      {/* 菜单 */}
      <Layout.Sider width={240} theme='light'>
        <LogoLink />
        <Menu
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          selectedKeys={[currentMenuKey]}
          // theme={theme === 'default' ? 'light' : 'dark'}
        ></Menu>
      </Layout.Sider>
      <Layout>
        {/* header */}
        <Layout.Header></Layout.Header>
        {/* 内容 */}
        <Layout.Content>
          <AppRoutes />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout