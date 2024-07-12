/*
 * @Author: CP
 * @Date: 2024-07-09 09:50:45
 * @Description:
 */
import { useRef, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createGlobalStyle } from 'antd-style'
import { Dropdown, Button, Space, MenuProps } from 'antd'
import { EllipsisOutlined, ReloadOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import styled from 'styled-components'

const GlobalStyles = createGlobalStyle`
  :root {
    --tab-height: 40px;
  }
`

const StyledRoot = styled.div`
  height: var(--tab-height);
  line-height: var(--tab-height);
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: #fff;
`

const StyledTab = styled.div`
  flex: 1;

  .tab_content {
    overflow: hidden;
    width: 100%;
  }
`

const Tabs = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const tabRef = useRef(null)
  const tabContentRef = useRef(null)

  useEffect(() => {}, [pathname])

  const handleMove = (offset: number) => {
    console.log(offset, navigate, nanoid())
  }

  const handleScroll = (e: React.WheelEvent) => {
    let type = e.type

    let distance = 0

    if (type === 'wheel') {
      distance = e.deltaY ? e.deltaY * 2 : -(e.detail || 0) * 2
    }

    handleMove(distance)
  }

  // 重载
  const handleReload = () => {
    // 刷新当前路由，页面不刷新
    // const index = visitedTags.findIndex(tab => tab.fullPath === activeTag)
    // if (index >= 0) {
    //   // 这个是react的特性，key变了，组件会卸载重新渲染
    //   navigate(activeTag, { replace: true, state: { key: nanoid() } })
    // }
  }

  const items = useMemo(() => {
    return [
      { key: 'left', label: '关闭左侧' },
      { key: 'right', label: '关闭右侧' },
      { key: 'other', label: '关闭其它' },
      { key: 'all', label: '关闭所有' }
    ]
  }, [])

  const handleItemClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'all') {
      //
    }
  }

  return (
    <>
      <GlobalStyles />
      <StyledRoot className="tab_wrapper">
        <StyledTab ref={tabRef} className="tab" onWheel={handleScroll}>
          <div ref={tabContentRef} className="tab_content"></div>
        </StyledTab>
        <Space size={12}>
          <Button size="small" icon={<ReloadOutlined />} onClick={handleReload}></Button>
          <Dropdown menu={{ items, onClick: handleItemClick }} placement="bottomLeft">
            <Button icon={<EllipsisOutlined />} size="small"></Button>
          </Dropdown>
        </Space>
      </StyledRoot>
    </>
  )
}

export default Tabs
