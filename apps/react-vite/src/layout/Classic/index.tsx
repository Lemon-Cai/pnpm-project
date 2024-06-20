/*
 * @Author: CP
 * @Date: 2024-06-18 17:12:38
 * @Description:
 */
import { Layout as AntLayout } from 'antd'
import Page from '@/components/Page'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useGlobalStore } from '@/store'

import AppLogo from '../components/AppLogo'
import CollapseTrigger from '../components/CollapseTrigger'
import Toolbar from '../components/Toolbar'

import { CLASSIC_SIDER_WIDTH, CLASSIC_COLLAPSE_WIDTH } from '../constants'

const StyledContent = styled(Page.Content)`
  padding: 12px 0 12px 12px;
  height: 100%;
  overflow: hidden;
`

const StyledHeader = styled(Page.Header)`
  padding: 0 12px;
  display: flex;
  align-items: center;
  /* background: linear-gradient(45deg, #20e0c0ed, #92eddeba, #5be0cae0), linear-gradient(to bottom, #6ccac4, #3c917e); */

  .header-right {
    flex: 1;
    display: flex;
    align-items: center;

    .menu {
      flex: 1;
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
      <StyledHeader>
        {/* logo */}
        <AppLogo isCollapse={isCollapse} width={!isCollapse ? CLASSIC_SIDER_WIDTH : CLASSIC_COLLAPSE_WIDTH} />
        <div className='header-right'>
          {/* trigger， 触发 菜单栏收起 */}
          <CollapseTrigger isCollapse={isCollapse} />
          {/* 一级菜单 */}
          <div className='menu'></div>
          {/* toolbar */}
          <Toolbar />
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
