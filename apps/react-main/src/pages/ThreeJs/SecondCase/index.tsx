import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GUI } from 'dat.gui'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Layout } from 'antd'

import './index.scss'

/**
 * three js 的第二个demo
 * @description 通过gui创建一个盒子模型
 */
const SecondCase = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  // const [containerRef, setContainerRef] = useState(null)
  const [state] = useState({
    rendered: false,
    // gui: new GUI({
    //   container: (document.querySelector('.container') || document.body) as HTMLElement
    // })
  })
  useEffect(() => {
    if (!state.rendered && containerRef.current) {
      state.rendered = true
      initScene()
    }
    return () => {
      window.removeEventListener('resize', () => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   return  () => {
  //     // 页面跳转，销毁时，销毁gui控制器
  //     state.gui?.destroy()
  //   }
  // }, [state.gui])

  const initScene = () => {
    function updateGroupGeometry(mesh: any, geometry: any) {
      mesh.children[0].geometry.dispose()
      mesh.children[1].geometry.dispose()

      mesh.children[0].geometry = new THREE.WireframeGeometry(geometry)
      mesh.children[1].geometry = geometry

      // these do not update nicely together if shared
    }

    const guis = {
      BoxGeometry: function (mesh: any) {
        const data = {
          width: 15,
          height: 15,
          depth: 15,
          widthSegments: 1,
          heightSegments: 1,
          depthSegments: 1,
        }

        function generateGeometry() {
          updateGroupGeometry(
            mesh,
            new THREE.BoxGeometry(
              data.width,
              data.height,
              data.depth,
              data.widthSegments,
              data.heightSegments,
              data.depthSegments
            )
          )
        }

        const folder = gui.addFolder('THREE.BoxGeometry')

        folder.add(data, 'width', 1, 30).onChange(generateGeometry)
        folder.add(data, 'height', 1, 30).onChange(generateGeometry)
        folder.add(data, 'depth', 1, 30).onChange(generateGeometry)
        folder
          .add(data, 'widthSegments', 1, 10)
          .step(1)
          .onChange(generateGeometry)
        folder
          .add(data, 'heightSegments', 1, 10)
          .step(1)
          .onChange(generateGeometry)
        folder
          .add(data, 'depthSegments', 1, 10)
          .step(1)
          .onChange(generateGeometry)

        generateGeometry()
      },
    }

    const gui = new GUI({
      container: (document.querySelector('.container') || document.body) as HTMLElement
    })
    // 修改gui界面的摆放位置
    gui.domElement.style.position = 'absolute'
    gui.domElement.style.right = '15px'
    gui.domElement.style.top = '0'

    function chooseFromHash(mesh: any) {
      const selectedGeometry = 'BoxGeometry'

      if (guis[selectedGeometry] !== undefined) {
        guis[selectedGeometry](mesh)
      }
    }

    // @ts-ignore
    let { clientHeight, clientWidth } = containerRef.current

    const scene = new THREE.Scene()

    scene.background = new THREE.Color(0x444444)

    const camera = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      50
    )
    camera.position.z = 30
    camera.lookAt(0, 0, 10)

    const lights = []
    lights[0] = new THREE.DirectionalLight(0xffffff, 3)
    lights[1] = new THREE.DirectionalLight(0xffffff, 3)
    lights[2] = new THREE.DirectionalLight(0xffffff, 3)

    lights[0].position.set(0, 200, 0)
    lights[1].position.set(100, 200, 100)
    lights[2].position.set(-100, -200, -100)

    scene.add(lights[0])
    scene.add(lights[1])
    scene.add(lights[2])

    const group = new THREE.Group()

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    })
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    })

    group.add(new THREE.LineSegments(geometry, lineMaterial))
    group.add(new THREE.Mesh(geometry, meshMaterial))

    chooseFromHash(group)

    scene.add(group)

    //  创建个渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    console.log('clientWidth, clientHeight', clientWidth, clientHeight)
    // 定义threejs输出画布的尺寸(单位:像素px)；
    renderer.setSize(clientWidth, clientHeight)
    // 设置three.js渲染区域的尺寸(像素px)
    renderer.setPixelRatio(window.devicePixelRatio)

    containerRef.current?.appendChild(renderer.domElement)

    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.enableZoom = false
    // 执行渲染操作

    function render() {
      requestAnimationFrame(render)

      group.rotation.x += 0.005
      group.rotation.y += 0.005

      renderer.render(scene, camera)
    }

    window?.addEventListener(
      'resize',
      function () {
        console.log(1111);
        camera.aspect =
          (containerRef.current?.clientWidth || 0) /
          (containerRef.current?.clientHeight || 1)
        camera.updateProjectionMatrix()

        renderer.setSize(
          containerRef.current?.clientWidth || 0,
          containerRef.current?.clientHeight || 0
        )
      },
      false
    )

    render()
  }

  return (
    <Layout className='container'>
      <Layout.Content>
        <div ref={containerRef} className='three-content'></div>
      </Layout.Content>
    </Layout>
  )
}

export default SecondCase
