/*
 * @Author: CP
 * @Date: 2024-06-11 11:20:50
 * @Description: 
 */

import { useRef } from 'react'
import { init as initRain } from './rain'
import useMounted from '@/hooks/useMounted'
import styled from 'styled-components'

const Root = styled.div`
  position: relative;
`

const Case = () => {

  const rainRef = useRef(null)

  useMounted(() => {
    initRain(rainRef.current)
  })

  return (
    <Root className='rain' ref={rainRef}></Root>
  )
}

export default Case