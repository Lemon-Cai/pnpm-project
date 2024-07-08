import {
  Viewer,
  Entity,
  Terrain,
  Cartesian3,
  Cartesian2,
  Color,
  Math as CesiumMath,
  VerticalOrigin,
  NearFarScalar,
  DistanceDisplayCondition,
  LabelStyle,
  ConstantPositionProperty,
  CallbackProperty,
  Cartographic,
  Ellipsoid
} from 'cesium'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import useMounted from '@/hooks/useMounted'
import MarkerPng from '@/assets/images/cesium/marker.png'

// 扩展 Entity 类型以包含 objFlag 属性
interface ExtendedEntity extends Entity {
  objFlag?: {
    sn?: string
    name?: string
  }
  positionInfo?: {
    longitude: number
    latitude: number
  }
  clearFlag?: string
}

// type State = {
//   data: { [key: string | symbol]: any }
//   position: [number, number, number]
// }

const Root = styled.div`
  position: relative;
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
    (!viewer || (viewer && viewer?.isDestroyed?.())) && init()
  })

  useEffect(() => {
    if (viewer && !viewer.isDestroyed()) {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(119.32, 32, 1500)
      })

      addDynamicUpdateEntity()

      loop()
    }
    return () => {
      if (viewer) {
        viewer.destroy()
        setViewer(undefined) // Reset the viewer state on unmount
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer])

  function init() {
    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Viewer('cesiumContainer', {
      terrain: Terrain.fromWorldTerrain()
    })

    setViewer(viewer)
  }

  const addDynamicUpdateEntity = () => {
    let position = [119.32, 32, 0]
    let label = '文本'

    function fn() {
      if (viewer) {
        viewer.entities.add({
          id: 'uav_entity',
          position: new CallbackProperty(() => {
            // return Cartographic.toCartesian(
            //   new Cartographic(state.position[0], state.position[1], state.position[2]),
            //   Ellipsoid.WGS84
            // );

            const cartographic = Cartographic.fromDegrees(position[0], position[1], position[2])
            return Cartographic.toCartesian(cartographic, Ellipsoid.WGS84)
            // return Cartesian3.fromDegrees(state.position[0], state.position[1], state.position[2])
          }, false),
          billboard: {
            image: MarkerPng,

            // scale: 2.0, // default: 1.0
            // color: Color.LIME, // default: WHITE
            // rotation: CesiumMath.PI_OVER_FOUR, // default: 0.0
            // alignedAxis: Cartesian3.ZERO, // default
            width: 48, // default: undefined
            height: 48, // default: undefined
            pixelOffset: new Cartesian2(0, 0 || 0),
            verticalOrigin: VerticalOrigin.BOTTOM,
            scaleByDistance: new NearFarScalar(500, 1, 80000, 0.5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new DistanceDisplayCondition(0, 15000),
            // 是否显示
            show: true // default
          },
          label: {
            // CallbackProperty 可以理解成一个监听，如果 返回值改
            // eslint-disable-next-line
            // @ts-ignore
            // eslint-disable-next-line
            text: new CallbackProperty((time, result) => {
              return label
            }, false),
            // font: fontInfo,
            fillColor: Color.fromCssColorString('#fff'),
            style: LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 0,
            // horizontalOrigin: HorizontalOrigin.LEFT,
            // verticalOrigin: VerticalOrigin.CENTER,
            verticalOrigin: VerticalOrigin.BOTTOM,
            // pixelOffset: new Cartesian2(pixelOffset.offsetY, pixelOffset.offsetX || -30),
            showBackground: !0,
            // backgroundColor: Color.fromCssColorString(labelBackground),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new DistanceDisplayCondition(0, 15000),
            // 是否显示
            show: true
          }
        })
      }
    }

    fn()

    let count = 0
    let timer = setInterval(() => {
      count++
      if (count > 20) {
        clearInterval(timer)
        return
      }
      position = [
        119.32 + 2 * Math.ceil(Math.random() * 1000) / 1000000,
        32 + Math.ceil(Math.random() * 1000) / 1000000,
        0
      ]
      label = `速度：${Math.ceil(Math.random() * 10)}， 海拔：${Math.ceil(Math.random() * 1000)}`
    }, 5000)
  }

  function updateEntity(
    position: [number, number, number],
    objFlag: { [key: string | symbol]: any } = {}
  ) {
    if (viewer && !viewer.isDestroyed()) {
      // let entities = viewer.entities
      let entitiesValues = (viewer.entities.values as ExtendedEntity[]) || []
      let entity = entitiesValues.find((item) => item.objFlag?.sn === objFlag.sn)
      if (entity) {
        entity.position = new ConstantPositionProperty(
          Cartesian3.fromDegrees(position[0], position[1], position[2])
        )
        // if (entity?.label?.text) {
        //   entity.label.text!._value = objFlag.name
        // }
      } else {
        viewer.entities.add({
          ...{
            clearFlag: 'uav',
            objFlag: { sn: 'sn_11111' },
            positionInfo: {
              longitude: 119.32,
              latitude: 32
            }
          },
          // tempPosition,
          position: Cartesian3.fromDegrees(position[0], position[1], position[2]),
          billboard: {
            image: MarkerPng,

            // scale: 2.0, // default: 1.0
            // color: Color.LIME, // default: WHITE
            rotation: CesiumMath.PI_OVER_FOUR, // default: 0.0
            // alignedAxis: Cartesian3.ZERO, // default
            width: 48, // default: undefined
            height: 48, // default: undefined
            pixelOffset: new Cartesian2(0, 0 || 0),
            verticalOrigin: VerticalOrigin.BOTTOM,
            scaleByDistance: new NearFarScalar(500, 1, 80000, 0.5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new DistanceDisplayCondition(0, 15000),
            // 是否显示
            show: true // default
          },
          label: {
            // CallbackProperty 可以理解成一个监听，如果 返回值改变可动态刷新
            text: new CallbackProperty((time, result) => {
              result = result || '' + objFlag.name || '无人机阿瑟斯'
              return result
            }, false),
            font: '12px sans-serif',
            fillColor: Color.fromCssColorString('#fff'),
            style: LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 0,
            // horizontalOrigin: HorizontalOrigin.LEFT,
            // verticalOrigin: VerticalOrigin.CENTER,
            verticalOrigin: VerticalOrigin.BOTTOM,
            // pixelOffset: new Cartesian2(pixelOffset.offsetY, pixelOffset.offsetX || -30),
            showBackground: !0,
            // backgroundColor: Color.fromCssColorString(labelBackground),
            // 设置距离方位内，Billboard或Label的缩放比例
            // new Cesium.NearFarScalar ( near , nearValue , far , farValue )
            //  < 500, 缩放比例 1; 500 ~ 80000: 作坊比例 (0 - 1);  > 80000: 缩放比例 0
            scaleByDistance: new NearFarScalar(500, 1, 80000, 0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new DistanceDisplayCondition(0, 15000),
            // 是否显示
            show: true
          }
        })
      }
    }
  }

  function loop() {
    let count = 0
    let timer = setInterval(() => {
      count++
      if (count > 20) {
        clearInterval(timer)
        return
      }

      // 这里不生效，cesium 并没有刷新
      // setState((prev) => ({
      //   ...prev,
      //   data: {
      //     label: `速度：${Math.ceil(Math.random() * 10)}， 海拔：${Math.ceil(Math.random() * 1000)}`
      //   },
      //   position: [
      //     119.32 + Math.ceil(Math.random() * 1000) / 1000000,
      //     32 + Math.ceil(Math.random() * 1000) / 1000000,
      //     0
      //   ]
      // }))

      // // 强制刷新视图
      // viewer?.scene && viewer.scene.requestRender()
      updateEntity(
        [
          119.32 + Math.ceil(Math.random() * 1000) / 1000000,
          32 + Math.ceil(Math.random() * 1000) / 1000000,
          0
        ],
        {
          name: `速度：${Math.ceil(Math.random() * 10)}， 海拔：${Math.ceil(Math.random() * 1000)}`,
          sn: 'sn_11111'
        }
      )
    }, 5000)
  }

  return <Root id="cesiumContainer"></Root>
}

export default Case
