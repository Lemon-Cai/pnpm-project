import { defineComponent, onMounted } from 'vue'

import 'ol/ol.css'
import Feature from 'ol/Feature.js'
import Map from 'ol/Map.js'
import View from 'ol/View.js'

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'

import { Vector as VectorSource } from "ol/source";
import { LineString, /* Point */ } from 'ol/geom'

// import Polyline from 'ol/format/Polyline.js'
import XYZ from 'ol/source/XYZ.js'
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style.js'


// import data from './data.json'
import { fromLonLat } from 'ol/proj'

export default defineComponent({
  name: 'Openlayers',
  setup(props: any) {
    const init = () => {

      const map = initMap()
      // const polyline = data.routes[0].geometry

      const lines_arr: any = []

      // 添加一个点
      const lines_0 = [118.06, 31.67]
      lines_arr.push(lines_0)
      let new_p = null
      const x_num = 0.1
      for (let j = 0; j < 20; j++) {
        new_p = [
          Math.random() > 0.5
            ? lines_arr[lines_arr.length - 1][0] + Math.random() * x_num
            : lines_arr[lines_arr.length - 1][0] - Math.random() * x_num,
          lines_arr[lines_arr.length - 1][1] + Math.random() * x_num
        ]
        lines_arr.push(new_p)
      }

      // const featureLine = new Feature({
      //   geometry: new LineString(lines_arr)
      // })

      // const sourceLine = new VectorSource({
      //   features: [featureLine]
      // })

      // const vectorLine = new VectorLayer({
      //   source: sourceLine
      // })

      // map.addLayer(vectorLine)

      // const route = new Polyline({
      //   factor: 1e6
      // }).readGeometry(polyline, {
      //   dataProjection: 'EPSG:4326',
      //   featureProjection: 'EPSG:3857'
      // })

      // const route = new Polyline({
      //   factor: 1e6
      // }).writeGeometry(new LineString(lines_arr));

      // const routeFeature = new Feature({
      //   type: 'route',
      //   geometry: new LineString(lines_arr)
      // })

      // const route = new Polyline({
      //   factor: 1e6,
      // }).readGeometry(polyline, {
      //   dataProjection: 'EPSG:4326',
      //   featureProjection: 'EPSG:3857',
      // });
  
      // const routeFeature = new Feature({
      //   type: 'route',
      //   geometry: route,
      // });
      // const startMarker = new Feature({
      //   type: 'icon',
      //   // @ts-ignore
      //   geometry: new Point(route.getFirstCoordinate())
      // })
      // const endMarker = new Feature({
      //   type: 'icon',
      //   // @ts-ignore
      //   geometry: new Point(route.getLastCoordinate())
      // })
      // const position = startMarker.getGeometry().clone()
      // const geoMarker = new Feature({
      //   type: 'geoMarker',
      //   geometry: position
      // })

      const styles = {
        route: new Style({
          stroke: new Stroke({
            width: 10,
            color: [237, 212, 0, 0.8]
          })
        }),
        icon: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'data/icon.png'
          })
        }),
        geoMarker: new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: 'black' }),
            stroke: new Stroke({
              color: 'white',
              width: 2
            })
          })
        })
      }
      // const _data = [
      //   [108.945951, 34.465262],
      //   [109.04724, 34.262504],
      //   [108.580321, 34.076162],
      //   [110.458983, 35.071209],
      //   [105.734862, 35.49272],
      // ];
      const routes = lines_arr.map((item: any) => {
        return fromLonLat(item);
      });
      // 如果是： EPSG:4326， 直接传经纬度即可
      // 如果是： EPSG:3857 (默认投影) 需要转 fromLonLat([lon, lat])
      console.log('-================>>>', lines_arr, routes);
      const routeFeature = new Feature({
        type: 'route',
        geometry: new LineString(lines_arr)
      });

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          wrapX: false,
          features: [routeFeature] // , geoMarker, startMarker, endMarker
        }),
        style: function (feature) {
          // @ts-ignore
          return styles[feature.get('type')]
        }
      })

      map.addLayer(vectorLayer)

      // const speedInput = document.getElementById('speed')
      // const startButton = document.getElementById('start-animation')
      // let animating = false
      // let distance = 0
      // let lastTime: any

      // function moveFeature(event: any) {
      //   // @ts-ignore
      //   const speed = Number(speedInput?.value)
      //   const time = event.frameState.time
      //   const elapsedTime = time - lastTime
      //   distance = (distance + (speed * elapsedTime) / 1e6) % 2
      //   lastTime = time

      //   // @ts-ignore
      //   const currentCoordinate = route.getCoordinateAt(distance > 1 ? 2 - distance : distance)
      //   position.setCoordinates(currentCoordinate)
      //   const vectorContext = getVectorContext(event)
      //   vectorContext.setStyle(styles.geoMarker)
      //   vectorContext.drawGeometry(position)
      //   // tell OpenLayers to continue the postrender animation
      //   map.render()
      // }

      // function startAnimation() {
      //   animating = true
      //   lastTime = Date.now()
      //   // startButton.textContent = 'Stop Animation'
      //   vectorLayer.on('postrender', moveFeature)
      //   // hide geoMarker and trigger map render through change event
      //   geoMarker.setGeometry(null)
      // }

      // function stopAnimation() {
      //   animating = false
      //   // startButton.textContent = 'Start Animation'

      //   // Keep marker at current animation position
      //   geoMarker.setGeometry(position)
      //   vectorLayer.un('postrender', moveFeature)
      // }

      // startButton && startButton.addEventListener('click', function () {
      //   if (animating) {
      //     stopAnimation()
      //   } else {
      //     startAnimation()
      //   }
      // })
    }

    const initMap = () => {
      
      // const center = [118.06, 31.67] // [-5639523.95, -3501274.52]
      return  new Map({
        target: document.getElementById('map'),
        view: new View({
          // center: fromLonLat([118.06, 31.67]),
          center: [118.06, 31.67],
          projection: 'EPSG:4326',
          zoom: 8,
          minZoom: 2,
          maxZoom: 19
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              // attributions: attributions,
              url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',

              // tileSize: 512
            })
          })
        ]
      })
    }
    onMounted(() => {
      init()

      console.log(props);
      // initMap()
    })

    return () => (
      <div class="page" style="width: 100%; height: 100%;">
        {/* defineComponent */}

        <div id="map" style="width: 100%; height: 100%;"></div>
      </div>
    )
  }
})
