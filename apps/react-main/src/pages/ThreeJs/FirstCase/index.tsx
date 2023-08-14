import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Layout } from 'antd'

import './index.scss'

// 创建第一个threejs 案例
const FirstCase = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  // const [containerRef, setContainerRef] = useState(null)
  const [state] = useState({
    rendered: false,
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

  const initScene = () => {
    // @ts-ignore
    let { clientHeight, clientWidth } = containerRef.current

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('skyblue')

    // 创建一个观察辅助坐标系
    const axesHelper = new THREE.AxesHelper(150)
    scene.add(axesHelper)

    // 创建相机
    // const camera = new THREE.PerspectiveCamera(1, 1, 2, 1000)

    const fov = 35 // AKA Field of View
    const aspect = clientWidth / clientHeight
    const near = 0.1 // the near clipping plane
    const far = 2000 // the far clipping plane

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    // 根据需要设置相机位置具体值
    camera.position.set(500, 500, 500)
    // 设置相机视角 相机观察目标指向Threejs 3D空间中某个位置
    camera.lookAt(0, 0, 0)

    // 创建几何体 BoxGeometry：是长方体几何对象Geometry
    const geometry = new THREE.BoxGeometry(100, 100, 100)

    // 创建材质
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(10, 255, 80),
      // color: 0xff0000
      transparent: true, //开启透明
      opacity: 0.5, //设置透明度
    })

    // 创建网格
    const mesh = new THREE.Mesh(geometry, material)
    // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mesh.position.set(0, 0, -10)

    scene.add(mesh)

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

    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    window.addEventListener('resize', () => {
      camera.aspect =
          (containerRef.current?.clientWidth || 0) /
          (containerRef.current?.clientHeight || 1)
        camera.updateProjectionMatrix()

        renderer.setSize(
          containerRef.current?.clientWidth || 0,
          containerRef.current?.clientHeight || 0
        )
    }, false)
    animate()
  }

  return (
    <Layout className='container'>
      <Layout.Content>
        <div ref={containerRef} className='three-content'></div>
      </Layout.Content>
    </Layout>
  )
}

export default FirstCase
