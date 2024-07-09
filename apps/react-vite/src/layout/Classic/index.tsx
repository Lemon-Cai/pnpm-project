/*
 * @Author: CP
 * @Date: 2024-06-18 17:12:38
 * @Description:
 */
import { useEffect, useMemo, useState } from 'react'
import { Layout as AntLayout, Menu as AntMenu, MenuProps } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { createStyles } from 'antd-style'

import { useGlobalStore, useMenuStore } from '@/store'
import { MenuItem } from '@/store/types'
import Page from '@/components/Page'
import { findTreeNode, getOpenKeys } from '@/utils'

import HeadMenuBG from '@/assets/images/layout/header_menu_bg.png'

import AppLogo from '../components/AppLogo'
import CollapseTrigger from '../components/CollapseTrigger'
import Toolbar from '../components/Toolbar'
import Menu from './components/Menu'
import Tabs from './components/Tabs'

import { CLASSIC_SIDER_WIDTH, CLASSIC_COLLAPSE_WIDTH, CLASSIC_TOOLBAR_WIDTH } from '../constants'
import './index.scss'

const GlobalStyle = createGlobalStyle`
  :root {
    --classic-head-color: #fff;
  }
`
const useStyles = createStyles(({ css, prefixCls }) => ({
  layout: css`
    // ↓
    &.${prefixCls}-layout {
      background: #f5f5f5;
      #main {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #fff;
        /* padding: 12px 0 12px 12px; */
      }
    }
  `,
  content: css`
    &.${prefixCls}-layout-content {
      padding: 12px 0 12px 12px;
    }
  `
}))

// const StyledPage = styled(Page)`
//   padding: 12px 0 12px 12px;
// `

const StyledHeader = styled(Page.Header)`
  padding: 0 12px;
  display: flex;
  align-items: center;
  /* background: linear-gradient(45deg, #20e0c0ed, #92eddeba, #5be0cae0),
    linear-gradient(to bottom, #6ccac4, #3c917e); */
  background: linear-gradient(45deg, #306363, #376d64, #032d26),
    linear-gradient(to bottom, #6ccac4, #3c917e);

  .header-right {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
  }
  .menu_wrapper {
    flex: 1;
    background: url(${() => HeadMenuBG});
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .menu {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 32px;
      &-item {
        cursor: pointer;
      }
    }
  }
`
const { Sider } = AntLayout

const transform = (list: MenuItem[]): MenuProps['items'] => {
  return list.map((item) => {
    let children = item.children?.length > 0 ? transform(item.children) : null
    return {
      key: item.path,
      label: item.name,
      // icon: <SettingOutlined />,
      children: children
    }
  })
}

const Classic = () => {
  const { styles, cx } = useStyles()
  const { state, pathname } = useLocation()
  const { key = 'key' } = state || {}

  const navigate = useNavigate()

  const isCollapse = useGlobalStore((state) => state.isCollapse)

  // const updateState = useGlobalStore(state => state.updateState)
  const menuList = useMenuStore((state) => state.currentMenuList)

  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname])
  const [openKeys, setOpenKeys] = useState<string[]>([])

  // 刷新页面菜单保持高亮
  useEffect(() => {
    setSelectedKeys([pathname])
    isCollapse ? null : setOpenKeys(getOpenKeys(pathname))
  }, [pathname, isCollapse])

  const menuItems = useMemo(() => {
    console.log('这是刷新次数')
    return transform(menuList)
    // eslint-disable-next-line
  }, [JSON.stringify(menuList)])

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    let route = findTreeNode(menuList, key, 'path')
    if (route?.meta?.isLink) {
      
      return
    }
    if (route) {
      // updateState({ pathname: route.path })
      setSelectedKeys([route.path])
    }
    console.log('===========', route)
    navigate(route.path)
  }

  const handleOpenChange: MenuProps['onOpenChange'] = (keys: string[]) => {
    if (keys.length === 0 || keys.length === 1) return setOpenKeys(keys)
    const latestKey = keys[keys.length - 1]
    if (latestKey.includes(keys[0])) return setOpenKeys(keys)
    setOpenKeys([latestKey])
  }

  return (
    <Page>
      {/* 全局样式， 不会渲染成dom */}
      <GlobalStyle />
      <StyledHeader>
        {/* logo */}
        <AppLogo
          isCollapse={isCollapse}
          width={!isCollapse ? CLASSIC_SIDER_WIDTH : CLASSIC_COLLAPSE_WIDTH}
        />
        <div className="header-right">
          {/* trigger， 触发 菜单栏收起 */}
          <CollapseTrigger isCollapse={isCollapse} />
          {/* 一级菜单 */}
          <Menu />
          {/* toolbar */}
          <Toolbar className="toolbar" width={CLASSIC_TOOLBAR_WIDTH} />
        </div>
      </StyledHeader>
      <Page hasSider>
        {/* 侧边栏 */}
        <Sider
          width={CLASSIC_SIDER_WIDTH}
          collapsedWidth={CLASSIC_COLLAPSE_WIDTH}
          trigger={null}
          theme="light"
          collapsible
          collapsed={isCollapse}
        >
          {/* 其余菜单 */}
          <AntMenu
            triggerSubMenuAction="click"
            style={{ width: '100%' }}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            onOpenChange={handleOpenChange}
          />
        </Sider>
        <Page className={cx(styles.layout)}>
          <Tabs />
          {/* 主体内容 */}
          <Page.Content className={cx(styles.content)}>
            <div id="main">
              <Outlet key={key} />
            </div>
          </Page.Content>
        </Page>
      </Page>
    </Page>
  )
}

export default Classic
