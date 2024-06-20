/*
 * @Author: CP
 * @Date: 2024-06-19 11:14:28
 * @Description: 
 */
import styled from "styled-components"
import Language from "./Language"
import SearchMenu from "./SearchMenu"
import Skin from "./Skin"
import Notification from "./Notification"
import Avatar from "./Avatar"

interface ToolbarImpl extends React.HTMLAttributes<HTMLDivElement> {
  width: number
}

const StyledBlock = styled.div<{ $width: number }>`
  display: flex;
  align-items: center;
  width: ${props => props.$width}px;
  gap: 18px;
  > div, span {
    cursor: pointer;
  }
`
const Toolbar: React.FC<ToolbarImpl> = ({ width,  ...restProps}) => {

  return <StyledBlock $width={width} {...restProps} >
    <Language />
    <SearchMenu />
    <Skin />
    <Notification />
    <Avatar />
  </StyledBlock>
}

export default Toolbar