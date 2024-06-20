/*
 * @Author: CP
 * @Date: 2024-06-20 16:12:29
 * @Description:
 */

import { SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Divider, Radio, Switch, Tooltip } from 'antd'
import type { RadioChangeEvent } from 'antd'
import styled from 'styled-components'

import IconFont from '@/components/Icon'
import { useGlobalStore } from '@/store'

import SwitchDark from './SwitchDark'

const StyledLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 25px 0;
  > span {
    font-size: 14px;
    > .icon {
      margin: 0 4px;
    }
  }
  .ant-switch {
    width: 46px;
  }
`

const layoutList = [
  {
    key: 'vertical',
    label: '横向布局'
  },
  {
    key: 'columns',
    label: '纵向布局'
  },
  {
    key: 'classic',
    label: '经典布局'
  }
]

const GlobalSetting = () => {
  const state = useGlobalStore((state) => state)
  const updateState = useGlobalStore((state) => state.updateState)

  const handleChange = (e: RadioChangeEvent) => {
    updateState({
      layout: e.target.value
    })
  }
  return (
    <div>
      {/* 布局方式 */}
      {/* <Divider className="divider">
        <FireOutlined />
        布局方式
      </Divider> */}

      <Radio.Group value={state.layout} onChange={handleChange}>
        {layoutList.map((item) => (
          <Radio value={item.key} key={item.key}>
            {item.label}
          </Radio>
        ))}
      </Radio.Group>

      <StyledLine>
        <span>
          头部反转色
          <Tooltip title="设置头部背景色">
            <QuestionCircleOutlined className="icon" />
          </Tooltip>
        </span>
        <Switch
          checked={state.headBackground}
          onChange={(checked) => {
            updateState({
              headBackground: checked
            })
          }}
        />
      </StyledLine>

      {/* 全局主题 */}
      <Divider className="divider">
        <IconFont type="icon-skin" />
        <span className='title' style={{ marginLeft: 12 }}>全局主题</span>
      </Divider>

      <StyledLine>
        <span>暗黑模式</span>
        <SwitchDark />
      </StyledLine>
      <StyledLine>
        <span>灰色模式</span>
        <Switch
          checked={state.weakOrGray === 'gray'}
          onChange={(e) => {
            updateState({ weakOrGray: e ? 'gray' : '' })
          }}
        />
      </StyledLine>
      <StyledLine>
        <span>色弱模式</span>
        <Switch
          checked={state.weakOrGray === 'weak'}
          onChange={(e) => {
            updateState({ weakOrGray: e ? 'weak' : '' })
          }}
        />
      </StyledLine>
      <br />

      {/* 界面设置 */}
      <Divider className="divider">
        <SettingOutlined />
        <span className='title' style={{ marginLeft: 12 }}>界面设置</span>
      </Divider>

      <StyledLine className="theme-item">
        <span>折叠菜单</span>
        <Switch
          checked={state.isCollapse}
          onChange={(e) => {
            updateState({ isCollapse: e })
          }}
        />
      </StyledLine>
      <StyledLine className="theme-item">
        <span>一级菜单图标</span>
        <Switch
          checked={state.showTopMenuIcon}
          onChange={(e) => {
            updateState({ showTopMenuIcon: e })
          }}
        />
      </StyledLine>
      {/* <StyledLine className="theme-item">
					<span>面包屑导航</span>
					<Switch
						checked={!breadcrumb}
						onChange={e => {
							onChange(e, "breadcrumb");
						}}
					/>
				</StyledLine> */}
      <StyledLine className="theme-item">
        <span>标签栏</span>
        <Switch
          checked={state.showTabs}
          onChange={(e) => {
            updateState({ showTabs: e })
          }}
        />
      </StyledLine>
      <StyledLine className="theme-item">
        <span>页脚</span>
        <Switch
          checked={state.showFooter}
          onChange={(e) => {
            updateState({ showFooter: e })
          }}
        />
      </StyledLine>
    </div>
  )
}

export default GlobalSetting
