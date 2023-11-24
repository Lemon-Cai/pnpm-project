import { onMounted, defineComponent } from 'vue'

import * as ol from 'ol'

import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { OSM } from 'ol/source'
import { GeoJSON } from 'ol/format'
import { getCenter } from 'ol/extent'

import 'ol/ol.css'
import Page from '../components/Page'

export default defineComponent({
  setup() {
    onMounted(() => {
      const fieldData: any = {
        type: 'FeatureCollection',
        name: 'cro_fields',
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
          }
        },
        features: [
          {
            type: 'Feature',
            properties: {
              id: null,
              Name: 'Awesome field',
              Culture: 'Wheat',
              Desc: 'Some epic wheat fields',
              Area: 36707.0
            },
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [18.309797128121478, 45.382541186869091],
                    [18.312363567234836, 45.382125007553412],
                    [18.313245471022821, 45.381966463052201],
                    [18.312571656892676, 45.380836833481069],
                    [18.310857394473327, 45.381084559264217],
                    [18.309916036497388, 45.381282739890729],
                    [18.309301676555194, 45.381411557297959],
                    [18.309311585586521, 45.381411557297959],
                    [18.309311585586521, 45.381381830203985],
                    [18.309311585586521, 45.381381830203985],
                    [18.309321494617844, 45.381371921172658],
                    [18.309797128121478, 45.382541186869091]
                  ]
                ]
              ]
            }
          },
          {
            type: 'Feature',
            properties: {
              id: null,
              Name: 'Another field',
              Culture: 'Wheat',
              Desc: 'Another not so epic field',
              Area: 27070.0
            },
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [18.309440402993754, 45.381292648922056],
                    [18.309341312680498, 45.380817015418422],
                    [18.309311585586521, 45.380400836102744],
                    [18.309311585586521, 45.380400836102744],
                    [18.309301676555194, 45.380063929037668],
                    [18.309182768179287, 45.379132480093048],
                    [18.308211683109366, 45.379340569750894],
                    [18.307854957981643, 45.37944956909547],
                    [18.307894594106944, 45.381530465673869],
                    [18.308003593451527, 45.381550283736523],
                    [18.309440402993754, 45.381292648922056]
                  ]
                ]
              ]
            }
          },
          {
            type: 'Feature',
            properties: {
              id: null,
              Name: 'Super field',
              Culture: 'Corn',
              Desc: 'KORN',
              Area: 34130.0
            },
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [18.314365191562626, 45.380559380603955],
                    [18.314672371533725, 45.381173740546146],
                    [18.315187641162659, 45.382442096555835],
                    [18.317109993239846, 45.381996190146175],
                    [18.316455997172348, 45.380222473538879],
                    [18.316455997172348, 45.380222473538879],
                    [18.314365191562626, 45.380559380603955]
                  ]
                ]
              ]
            }
          },
          {
            type: 'Feature',
            properties: {
              id: null,
              Name: 'Epic field',
              Culture: 'Olive',
              Desc: 'Another epic field',
              Area: 31032.0
            },
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [16.217564617888129, 43.059299429339738],
                    [16.217921343015853, 43.059279611277091],
                    [16.218198795892974, 43.059180520963835],
                    [16.22115168722803, 43.05826889008187],
                    [16.221310231729241, 43.057892346891492],
                    [16.221092233040078, 43.057793256578236],
                    [16.220933688538864, 43.057595075951724],
                    [16.220636417599096, 43.057258168886648],
                    [16.220061693782203, 43.057476167575814],
                    [16.219328425464102, 43.057872528828838],
                    [16.218476248770092, 43.058308526207171],
                    [16.217445709512219, 43.058486888771036],
                    [16.217564617888129, 43.059299429339738]
                  ]
                ]
              ]
            }
          },
          {
            type: 'Feature',
            properties: {
              id: null,
              Name: 'Boring field',
              Culture: 'Apple',
              Desc: 'Super apple',
              Area: 3278.0
            },
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [16.21638544316037, 43.055692541937191],
                    [16.215275631651892, 43.056187993503471],
                    [16.215216177463937, 43.056197902534798],
                    [16.215216177463937, 43.056197902534798],
                    [16.215434176153103, 43.056475355411919],
                    [16.216514260567603, 43.05591054062635],
                    [16.21638544316037, 43.055692541937191]
                  ]
                ]
              ]
            }
          }
        ]
      }

      let geojsonData = new GeoJSON().readFeatures(fieldData, {
        featureProjection: 'EPSG:3857'
      })
      let vectorSource = new VectorSource({
        features: geojsonData
      })

      let vectorLayer = new VectorLayer({
        source: vectorSource
      })

      let map = new ol.Map({
        target: 'ol_map',
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new ol.View({
          center: [0, 0],
          zoom: 4
        })
      })

      map.getView().fit(vectorSource.getExtent())

      const duration = 2000

      let featureListElement = document.getElementById('vectorFeatures')

      let features = vectorLayer.getSource().getFeatures()
      for (let feature of features) {
        let aElement = document.createElement('a')
        aElement.classList.add('list-group-item', 'list-group-item-action')
        featureListElement.appendChild(aElement)
        aElement.innerHTML = feature.get('Name')
        aElement.onclick = function () {
          let view = map.getView()
          let extentOfPolygon = feature.getGeometry().getExtent()
          let resolution = view.getResolutionForExtent(extentOfPolygon)
          let center = getCenter(extentOfPolygon)
          let currentCenter = map.getView().getCenter()
          let currentResolution = map.getView().getResolution()
          let distance = Math.sqrt(
            Math.pow(center[0] - currentCenter[0], 2) + Math.pow(center[1] - currentCenter[1], 2)
          )
          let maxResolution = Math.max(distance / map.getSize()[0], currentResolution)
          let up = Math.abs(maxResolution - currentResolution)
          let down = Math.abs(maxResolution - resolution)
          let adjustedDuration = duration + Math.sqrt(up + down) * 100

          view.animate({
            center: center,
            duration: adjustedDuration
          })
          view.animate(
            {
              resolution: maxResolution,
              duration: (adjustedDuration * up) / (up + down)
            },
            {
              resolution: resolution,
              duration: (adjustedDuration * down) / (up + down)
            }
          )
        }
      }
    })
    return () => (
      <Page>
        <div class="row">
          <div class="list-group" id="vectorFeatures">
          </div>
        </div>
        <div id="ol_map" style="width: 100%; height: 100%;"></div>
      </Page>
    )
  }
})
