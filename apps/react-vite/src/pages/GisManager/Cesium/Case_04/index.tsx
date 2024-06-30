/*
 * @Author: CP
 * @Date: 2024-06-14 14:43:57
 * @Description:
 */
import useMounted from '@/hooks/useMounted'
import { Cartesian3, ConstantProperty, CzmlDataSource, JulianDate, Terrain, Viewer } from 'cesium'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Root = styled.div`
  width: 100%;
  height: 100%;
`
const Case = () => {
  let [viewer, setViewer] = useState<Viewer>()

  // const [state, setState] = useState<State>({
  //   data: {
  //     label: '2'
  //   },
  //   position: [119.32, 32, 0]
  // })

  useMounted(() => {
    ;(!viewer || (viewer && viewer?.isDestroyed?.())) && init()
  })

  useEffect(() => {
    if (viewer && !viewer.isDestroyed()) {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(119.32, 32, 1500)
      })

      addEntity()
    }
    return () => {
      if (viewer) {
        viewer.destroy()
        setViewer(undefined) // Reset the viewer state on unmount
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer])

  const init = () => {
    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Viewer('cesiumContainer', {
      terrain: Terrain.fromWorldTerrain(),
      //地形图层TerrainProvider
      
      // terrainProvider: createWorldTerrainAsync({
      //   requestWaterMask: true //水面特效
      // }), //viewer是所有api的入口

      //图层控件显隐控制
      timeline: false, //隐藏时间轴
      animation: false, //隐藏动画控制器
      geocoder: false, //隐藏地名查找控制器
      homeButton: false, //隐藏Home按钮
      sceneModePicker: false, //隐藏投影方式控制器
      baseLayerPicker: false, //隐藏图层选择控制器
      navigationHelpButton: false, //隐藏帮助按钮
      fullscreenButton: false //隐藏全屏按钮
    })

    setViewer(viewer)
  }

  const addEntity = () => {
    let czml = [
      {
        id: 'document',
        name: 'CZML Path',
        version: '1.0'
      },
      {
        id: 'path',
        name: 'path with GPS flight data',
        availability: '2023-08-04T16:00:00Z/2024-08-04T16:02:00Z',
        position: {
          epoch: '2023-08-04T16:00:00Z',
          cartographicDegrees: [
            0, -117.0, 35.0, 100000, 30, -117.0, 36.0, 100000, 60, -117.0, 37.0, 100000, 90, -117.0,
            38.0, 100000, 120, -117.0, 39.0, 100000
          ]
        },
        path: {
          material: {
            solidColor: {
              color: {
                rgba: [255, 255, 0, 255]
              }
            }
          },
          width: 5,
          leadTime: 10,
          trailTime: 1000,
          resolution: 5
        }
      }
    ]

    if (viewer) {
      let scene = viewer.scene
      let dataSource = CzmlDataSource.load(czml)
      viewer.dataSources.add(dataSource).then((res) => {
        let entityCollection = res.entities
        // / 计算实体集合的可用性时间间隔
        let availability = entityCollection.computeAvailability()

        console.log('availability', availability);
        // 创建标签实体
        let labelEntity = viewer?.entities.add({
          position: Cartesian3.fromDegrees(119, 32, 1000),
          label: {
            show: false,
            text: 'Sand'
          }
        })

        scene.preRender.addEventListener(() => {
          let currentDate = JulianDate.fromDate(new Date())

          if (
            JulianDate.greaterThanOrEquals(currentDate, availability.start) &&
            JulianDate.lessThanOrEquals(currentDate, availability.stop)
          ) {
            // 如果在可用性时间间隔内，则显示标签实体
            labelEntity!.label!.show = new ConstantProperty(true)
          } else {
            // 如果不在可用性时间间隔内，则隐藏标签实体
            labelEntity!.label!.show = new ConstantProperty(false)
          }
        })
      })
    }
  }

  return <Root id="cesiumContainer"></Root>
}

export default Case
