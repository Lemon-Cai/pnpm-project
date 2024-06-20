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

const StyledBlock = styled.div`
  display: flex;
  align-items: center;
`
const Toolbar = () => {

  return <StyledBlock>
    <Language />
    <SearchMenu />
    <Skin />
    <Notification />
  </StyledBlock>
}

export default Toolbar