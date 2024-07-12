/*
 * @Author: CP
 * @Date: 2024-06-19 09:49:01
 * @Description:
 */
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

// import Logo from '@/assets/images/layout/logo.png'
import LogoSvg from '@/assets/images/layout/logo.svg'

import { TITLE } from '../constants'
import { HOME_URL } from '@/config/constants'

interface StyledBlockProps {
  width: number
  $isCollapse: boolean // 使用$前缀来标记为 transient prop 。 避免 React 试图将 isCollapse 作为属性传递给原生的 div 元素
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
  justify-content: ${(props) => (props.$isCollapse ? 'center' : 'flex-start')};
  gap: 12px;
  transition: all 0.2s;
  cursor: pointer;
`

const StyledLogoImage = styled.img`
  width: 48px;
  height: 48px;
`

const StyledH2 = styled.h2`
  font-weight: 600;
`

const AppLogo: React.FC<AppLogoImpl> = (props) => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(HOME_URL)
  }
  return (
    <StyledBlock width={props.width} $isCollapse={props.isCollapse} onClick={handleGoHome}>
      <StyledLogoImage src={LogoSvg} alt="logo" />
      {!props.isCollapse ? <StyledH2>{TITLE}</StyledH2> : null}
    </StyledBlock>
  )
}

export default AppLogo
