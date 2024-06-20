/*
 * @Author: CP
 * @Date: 2024-06-19 09:49:01
 * @Description:
 */
import styled from 'styled-components'

// import Logo from '@/assets/images/layout/logo.png'
import LogoSvg from '@/assets/images/layout/logo.svg'

import { TITLE } from '../constants'

interface StyledBlockProps {
  width: number
  isCollapse: boolean
}

interface AppLogoImpl {
  width: number
  title?: string
  isCollapse: boolean
}

const StyledBlock = styled.div<StyledBlockProps>`
  width: ${(props) => props.width}px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapse ? 'center' : 'flex-start')};
  gap: 12px;
  transition: all 0.2s;
`

const StyledLogoImage = styled.img`
  width: 48px;
  height: 48px;
`

const StyledH2 = styled.h2`
  font-weight: 600;
`

const AppLogo: React.FC<AppLogoImpl> = (props) => {
  return (
    <StyledBlock width={props.width} isCollapse={props.isCollapse}>
      <StyledLogoImage src={LogoSvg} alt="logo" />
      {!props.isCollapse ? <StyledH2>{TITLE}</StyledH2> : null}
    </StyledBlock>
  )
}

export default AppLogo
