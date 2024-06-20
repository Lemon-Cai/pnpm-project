import { Layout as AntLayout } from 'antd'
import Page from '@/components/Page'
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';


const StyledContent = styled(Page.Content)`
  padding: 12px 0 12px 12px;
  height: 100%;
  overflow: hidden;
`
const { Sider } = AntLayout;


const Classic = () => {

  const { state } = useLocation()
  const { key = 'key' } = state || {}

  return (
    <Page>
      <Page.Header></Page.Header>
      <Page hasSider>
        {/* 侧边栏 */}
        <Sider width={280}>

        </Sider>
        {/*  */}
        <StyledContent>
          <Outlet key={key} />
        </StyledContent>
      </Page>
    </Page>
  )
}

export default Classic 