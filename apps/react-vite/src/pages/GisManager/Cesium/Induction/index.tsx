/*
 * @Author: CP
 * @Date: 2024-07-03 15:35:57
 * @Description: 
 */
import { Cartesian3, Color } from 'cesium'
// import { Viewer, Entity } from '@/components/Cesium'
import { Viewer, Entity } from 'resium'
import styled from 'styled-components'

const StyledRoot = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const Induction = () => {
  return (
    <StyledRoot>
      <Viewer full
        
      >
        <Entity
          position={Cartesian3.fromDegrees(118.32, 31.2, 1000)}
          point={{ pixelSize: 15, color: Color.YELLOW }}
        ></Entity>
      </Viewer>
    </StyledRoot>
  )
}

export default Induction