/*
 * @Author: CP
 * @Date: 2024-06-19 10:23:14
 * @Description:
 */
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useGlobalStore } from '@/store'
import styled from 'styled-components'

interface CollapseTriggerImpl {
  isCollapse: boolean
}

const StyledCollapse = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: var(--classic-head-color);
  transition: color 0.3s;
`

const CollapseTrigger: React.FC<CollapseTriggerImpl> = (props) => {
  const updateState = useGlobalStore((state) => state.updateState)

  const handleCollapse = () => {
    updateState({
      isCollapse: !props.isCollapse
    })
  }

  return (
    <StyledCollapse onClick={handleCollapse}>
      {props.isCollapse ? (
        <MenuUnfoldOutlined id="isCollapse" />
      ) : (
        <MenuFoldOutlined id="isCollapse" />
      )}
    </StyledCollapse>
  )
}

export default CollapseTrigger
