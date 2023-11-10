import { defineComponent, getCurrentInstance, onMounted, reactive } from 'vue'

import Feature from 'ol/Feature.js'
import LineString from 'ol/geom/LineString.js'
import Map from 'ol/Map.js'
// import StadiaMaps from 'ol/source/StadiaMaps'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector.js'
import View from 'ol/View.js'
import { Stroke, Style } from 'ol/style.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import { getVectorContext } from 'ol/render.js'
import { getWidth } from 'ol/extent.js'

import type RenderEvent from 'ol/render/Event'
// import type { Geometry } from 'ol/geom'

import Page from '../components/Page'

import * as Arc from './Arc'
import { fromLonLat } from 'ol/proj'

export default defineComponent({
  name: 'OlAnimate',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props: Readonly<any>) {

    const { proxy } = getCurrentInstance();

    const state = reactive<{ map: Map, pointsPerMs: number }>({
      map: null,
      pointsPerMs: 0.02
    })

    const tileLayer = new TileLayer({
      // source: new StadiaMaps({
      //   layer: 'stamen_toner'
      // })
      source: new XYZ({
        // projection: 'EPSG:4326',
        wrapX: false,
        // attributions: attributions,
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'

        // tileSize: 512
      })
    })

    const style = new Style({
      stroke: new Stroke({
        color: '#EAE911',
        width: 2
      })
    })

    const flightsSource = new VectorSource({
      loader: function () {
        const url = '/api/getFlightsData'
        fetch(url)
          .then(function (response) {
            console.log(response);
            return response.json()
          })
          .then(function (json) {
            const flightsData = json.flights
            for (let i = 0; i < flightsData.length; i++) {
              const flight = flightsData[i]
              const from = flight[0]
              const to = flight[1]

              // create an arc circle between the two locations
              const arcGenerator = new Arc.GreatCircle(
                { x: from[1], y: from[0] },
                { x: to[1], y: to[0] }
              )

              const arcLine = arcGenerator.Arc(100, { offset: 10 })
              // paths which cross the -180°/+180° meridian are split
              // into two sections which will be animated sequentially
              const features: Feature<LineString>[] = []
              arcLine.geometries.forEach(function (geometry) {
                const line = new LineString(geometry.coords)
                line.transform('EPSG:4326', 'EPSG:3857')

                features.push(
                  new Feature({
                    geometry: line,
                    finished: false
                  })
                )
              })
              // add the features with a delay so that the animation
              // for all features does not start at the same time
              addLater(features, i * 50)
            }
            tileLayer.on('postrender', animateFlights)
          })
      }
    })

    const flightsLayer = new VectorLayer({
      source: flightsSource,
      style: function (feature) {
        // if the animation is still active for a feature, do not
        // render the feature with the layer style
        if (feature.get('finished')) {
          return style
        }
        return null
      }
    })

    function animateFlights(event: RenderEvent) {
      const vectorContext = getVectorContext(event)
      const frameState = event.frameState
      vectorContext.setStyle(style)

      const features = flightsSource.getFeatures()
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        if (!feature.get('finished')) {
          // only draw the lines for which the animation has not finished yet
          const coords = (feature.getGeometry() as LineString).getCoordinates()
          const elapsedTime = frameState.time - feature.get('start')
          if (elapsedTime >= 0) {
            const elapsedPoints = elapsedTime * state.pointsPerMs

            if (elapsedPoints >= coords.length) {
              feature.set('finished', true)
            }

            const maxIndex = Math.min(elapsedPoints, coords.length)
            const currentLine = new LineString(coords.slice(0, maxIndex))

            // animation is needed in the current and nearest adjacent wrapped world
            const mapView = state.map.getView()
            const worldWidth = getWidth(mapView.getProjection().getExtent())
            const offset = Math.floor(mapView.getCenter()[0] / worldWidth)

            // directly draw the lines with the vector context
            currentLine.translate(offset * worldWidth, 0)
            vectorContext.drawGeometry(currentLine)
            currentLine.translate(worldWidth, 0)
            vectorContext.drawGeometry(currentLine)
          }
        }
      }
      // tell OpenLayers to continue the animation
      state.map.render()
    }

    function addLater(features: Feature<LineString>[], timeout: number) {
      window.setTimeout(function () {
        let start = Date.now()
        features.forEach(function (feature) {
          feature.set('start', start)
          flightsSource.addFeature(feature)
          const duration = (feature.getGeometry().getCoordinates().length - 1) / state.pointsPerMs
          start += duration
        })
      }, timeout)
    }

    const _initMap = () => {
      state.map = new Map({
        layers: [tileLayer],
        target: 'map',
        view: new View({
          // projection: 'EPSG:4326',
          center: fromLonLat([118.05, 31.889], 'EPSG:3857'),
          zoom: 4
        })
      })
    }

    onMounted(() => {

      console.log(proxy);

      _initMap()
      state.map.addLayer(flightsLayer);
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
        <div id="map" style="width: 100%; height: 100%;"></div>
        {/* way3: way2, 和 way3 不能共存 */}
        {/* {{
          default: () => <div id="map" style="width: 100%; height: 100%;"></div>,
          body: () => <div id="map1" >eeeeeeeeeeeeeeee</div>
        }} */}
      </Page>
    )
  }
})
