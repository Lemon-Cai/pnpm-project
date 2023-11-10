/*
 * @Author: CP
 * @Date: 2023-11-10 09:03:48
 * @Description: openlayers 地图点位实现闪烁效果
 */
import { defineComponent, reactive, onMounted } from 'vue'

import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { Map, View, Feature } from 'ol'
import { Style, Circle, Stroke } from 'ol/style'
import { Point } from 'ol/geom'
import { getVectorContext } from 'ol/render'
import CanvasImmediateRenderer from 'ol/render/canvas/Immediate.js'

import Page from '../components/Page'

export default defineComponent({
  name: 'OlAnimate',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props: Readonly<any>) {
    const state = reactive<{
      map: Map
      coordinates: { x: number | string; y: number | string }[]
      speed: number
    }>({
      map: null,
      coordinates: [
        { x: '106.918082', y: '31.441314' }, //重庆
        { x: '86.36158200334317', y: '41.42448570787448' }, //新疆
        { x: '89.71757707811526', y: '31.02619817424643' }, //西藏
        { x: '116.31694544853109', y: '39.868508850821115' }, //北京
        { x: '103.07940932026341', y: '30.438580338450862' } //成都
      ],
      speed: 0.3
    })

    const _initMap = () => {
      state.map = new Map({
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
            })
          })
        ],
        target: 'ol_map',
        view: new View({
          projection: 'EPSG:4326',
          center: [118.522097, 33.272848],
          zoom: 5
        })
      })
    }

    const _addDynamicPoints = (coordinates: { x: number | string; y: number | string }[]) => {
      // 设置图层
      const pointLayer: VectorLayer<VectorSource> = new VectorLayer({ source: new VectorSource() })
      // 添加图层
      state.map.addLayer(pointLayer)
      // 循环添加feature
      const pointFeature: any[] = []
      for (let i = 0; i < coordinates.length; i++) {
        // 创建feature，一个feature就是一个点坐标信息
        const feature = new Feature({
          geometry: new Point([coordinates[i].x as number, coordinates[i].y as number])
        })
        pointFeature.push(feature)
      }
      //把要素集合添加到图层
      pointLayer.getSource().addFeatures(pointFeature)
      // 关键的地方在此：监听postrender事件，在里面重新设置circle的样式
      let radius = 0
      pointLayer.on('postrender', (e) => {
        if (radius >= 20) radius = 0
        const opacity = (20 - radius) * (1 / 20) //不透明度
        const pointStyle = new Style({
          image: new Circle({
            radius: radius,
            stroke: new Stroke({
              color: 'rgba(255,0,0' + opacity + ')',
              width: 3 - radius / 10 //设置宽度
            })
          })
        })
        // 获取矢量要素上下文
        const vectorContext: CanvasImmediateRenderer = getVectorContext(e)
        vectorContext.setStyle(pointStyle)
        pointFeature.forEach((feature) => {
          vectorContext.drawGeometry(feature.getGeometry())
        })
        radius = radius + state.speed //调整闪烁速度
        //请求地图渲染（在下一个动画帧处）
        state.map.render()
      })
    }

    onMounted(() => {
      _initMap()
      _addDynamicPoints(state.coordinates)
    })

    return () => (
      <Page
      // way1：
      // v-slots={{
      //   default: () => <div id="map" style="width: 100%; height: 100%;"></div>,
      // }}

      // v-slots={{
      //   body: () => <div id="map1" >eeeeeeeeeeeeeeee</div>
      // }}
      >
        {/* way2： default 可以这么写 */}
        <div id="ol_map" style="width: 100%; height: 100%;"></div>
        {/* way3: way2, 和 way3 不能共存 */}
        {/* {{
          default: () => <div id="map" style="width: 100%; height: 100%;"></div>,
          body: () => <div id="map1" >eeeeeeeeeeeeeeee</div>
        }} */}
      </Page>
    )
  }
})
