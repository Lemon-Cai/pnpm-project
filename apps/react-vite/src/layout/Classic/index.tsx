/*
 * @Author: CP
 * @Date: 2024-06-18 17:12:38
 * @Description:
 */
import { Layout as AntLayout } from 'antd'
import Page from '@/components/Page'
import { Outlet, useLocation } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { useGlobalStore } from '@/store'

import HeadMenuBG from '@/assets/images/layout/header_menu_bg.png'

import AppLogo from '../components/AppLogo'
import CollapseTrigger from '../components/CollapseTrigger'
import Toolbar from '../components/Toolbar'
import Menu from './components/Menu'

import { CLASSIC_SIDER_WIDTH, CLASSIC_COLLAPSE_WIDTH, CLASSIC_TOOLBAR_WIDTH } from '../constants'
import './index.scss'

const GlobalStyle = createGlobalStyle`
  :root {
    --classic-head-color: #fff;
  }
`

const StyledContent = styled(Page.Content)`
  padding: 12px 0 12px 12px;
  height: 100%;
  overflow: hidden;
`

const StyledHeader = styled(Page.Header)`
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: linear-gradient(45deg, #20e0c0ed, #92eddeba, #5be0cae0), linear-gradient(to bottom, #6ccac4, #3c917e);

  .header-right {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    .menu_wrapper {
      flex: 1;
      background: url(${() => HeadMenuBG});
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .menu{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 32px;
      }
    }
  }
  
`
const { Sider } = AntLayout

const Classic = () => {
  const { state } = useLocation()
  const { key = 'key' } = state || {}

  const isCollapse = useGlobalStore((state) => state.isCollapse)

  // const updateState = useGlobalStore(state => state.updateState)

  return (
    <Page>
      {/* 全局样式， 不会渲染成dom */}
      <GlobalStyle />
      <StyledHeader>
        {/* logo */}
        <AppLogo isCollapse={isCollapse} width={!isCollapse ? CLASSIC_SIDER_WIDTH : CLASSIC_COLLAPSE_WIDTH} />
        <div className='header-right'>
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

        </Sider>
        {/* 主体内容 */}
        <StyledContent>
          <Outlet key={key} />
        </StyledContent>
      </Page>
    </Page>
  )
}

export default Classic
