/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @Description: 
 */
// import React, { useState } from 'react'
import { Cartesian3, Color, type Viewer, PolylineDashMaterialProperty } from 'cesium'
// import { Viewer as CesiumViewer , Entity } from '@/components/Cesium'
// import type { CesiumComponentRef } from '@/components/Cesium/core'
import { useRef, useEffect } from 'react'
import type { CesiumComponentRef } from 'resium'
import { CameraFlyTo, Viewer as CesiumViewer , Entity } from 'resium'

import styled from 'styled-components'

const StyledRoot = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const Advance = () => {
  // const [state, setState] = useState<{ obj: any }>({
  //   obj: null
  // })
  const viewerRef = useRef<CesiumComponentRef<Viewer>>(null)

  useEffect(() => {
    console.log('viewerRef', viewerRef)
    if (viewerRef.current?.cesiumElement) {
      viewerRef.current?.cesiumElement.entities.add({
        polyline: {
          positions: Cartesian3.fromDegreesArrayHeights([119.32, 32.32, 100, 119.44, 32.18, 100]),
          width: 3,
          material: new PolylineDashMaterialProperty({
            color: Color.fromCssColorString('#fa0'),
            dashLength: 10
          }),
          clampToGround: true,  // 贴地
        }
      })

      viewerRef.current.cesiumElement.camera.flyTo({
        destination: Cartesian3.fromDegrees(119.32, 32.32, 500)
      })

    }
  }, [])

  return (
    <StyledRoot>
      {/* Advance */}
      {/* 测试sentry */}
      {/* { state?.obj.a } */}
      <CesiumViewer  full
        ref={viewerRef}
      >
        <CameraFlyTo duration={5}  destination={Cartesian3.fromDegrees(119.32, 32.32, 500)} />
        <Entity
          position={Cartesian3.fromDegrees(118.32, 31.2, 1000)}
          point={{ pixelSize: 15, color: Color.YELLOW }}
        ></Entity>
      </CesiumViewer>
    </StyledRoot>
  )
}

export default Advance