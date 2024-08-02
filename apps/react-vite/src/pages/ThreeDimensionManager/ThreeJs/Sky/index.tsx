/*
 * @Author: CP
 * @Date: 2024-07-26 14:18:20
 * @Description:
 */
import { /* useEffect, */ useRef } from 'react'

import * as THREE from 'three'
import styled from 'styled-components'

import useMounted from '@/hooks/useMounted'
import { useGlobalStore } from '@/store'
import { useUpdateLayoutEffect } from 'ahooks'

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-behavior: smooth;
  color: #fff;

  > .skyBox {
    /* 不能给宽高，会挡住外层容器的滚动事件 */
    /* width: 100%;
    height: 100%; */
    z-index: 0;
    position: relative;
    canvas {
      user-select: none;
      /* 位置固定 */
      position: fixed;
      margin: 0;
      padding: 0;
    }
  }

  section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 3vw 0;
    z-index: 1;
  }
  h1,
  h2 {
    filter: drop-shadow(0 0 2px black);
  }
  h1 {
    font-size: 2rem;
  }
  h2 {
    margin: 1rem 0;
  }
  .sample_wrap {
    margin: 3rem 0;
  }
  .sample_img {
    display: inline-block;
    margin: 0 1rem;
  }
  .img {
    width: 35vw;
    height: auto;
    margin: 1rem 0;
    border: 3px solid white;
  }
`

const img_base = 'https://threejs.org/examples/textures/kandao3.jpg'
//let img_base = "https://happy358.github.io/Images/HDR/sunny_vondelpark_4k.jpg";
const img_depth = 'https://threejs.org/examples/textures/kandao3_depthmap.jpg'

const Sky = () => {
  const isCollapse = useGlobalStore((state) => state.isCollapse)

  const elementRef = useRef<HTMLDivElement>(null)

  // 场景
  let scene = useRef<THREE.Scene>()
  // 相机
  let camera = useRef<THREE.PerspectiveCamera>()
  // 渲染器
  let renderer = useRef<THREE.WebGLRenderer>()
  // 材质
  let spMesh = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>()
  let height = useRef<number>(0).current
  // let root = useRef<HTMLElement>(document.querySelector('#main'))

  useUpdateLayoutEffect(() => {
    // 初始化不执行，isCollapse 更新后会执行
    // 执行下resize方法
    // console.log('camera', camera)
    // 不延迟无法获得重绘后容器宽高信息
    setTimeout(() => handleResize(), 200)
  }, [isCollapse])

  // useEffect(() => {
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  //   // eslint-disable-next-line
  // }, [])
  useMounted(() => {
    if (elementRef.current) {
      init(elementRef.current)

      animate()
    }
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  const init = (target: HTMLDivElement) => {
    let container = document.querySelector('.container') as HTMLDivElement
    let { width, height: h } = container!.getBoundingClientRect()

    if (target) {
      scene.current = new THREE.Scene()
      scene.current.background = new THREE.Color(0x101010)

      // 雾
      // scene.fog = new THREE.Fog(0x101010, 200, 1000);
      // 设置光源
      const light = new THREE.AmbientLight(0xffffff, 3.3)
      scene.current.add(light)

      // 初始化相机
      camera.current = new THREE.PerspectiveCamera(70, width / h, 1, 50)
      // 设置方向
      // camera.lookAt(0, 0, 0)
      scene.current.add(camera.current)

      // 创建个球状几何体
      /**
     *  radius — 球体半径，默认为1。
        widthSegments — 水平分段数（沿着经线分段），最小值为3，默认值为32。
        heightSegments — 垂直分段数（沿着纬线分段），最小值为2，默认值为16。
        phiStart — 指定水平（经线）起始角度，默认值为0。。
        phiLength — 指定水平（经线）扫描角度的大小，默认值为 Math.PI * 2。
        thetaStart — 指定垂直（纬线）起始角度，默认值为0。
        thetaLength — 指定垂直（纬线）扫描角度大小，默认值为 Math.PI。
     */
      let spGeometry = new THREE.SphereGeometry(30, 500, 500)
      // 材质
      let spMaterial = new THREE.MeshStandardMaterial({
        // color: 0xfcc666,
        side: THREE.BackSide,
        displacementScale: -28.0 // 位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。如果没有设置位移贴图，则不会应用此值。默认值为1
      })
      // 网格
      spMesh.current = new THREE.Mesh(spGeometry, spMaterial)
      // 加入场景
      // scene.add(spMesh)

      // loading
      let loading = new THREE.LoadingManager()

      let loader = new THREE.TextureLoader(loading)

      loader.load(img_base, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.NearestFilter
        texture.generateMipmaps = false
        spMesh.current!.material!.map = texture
      })

      loader.load(img_depth, function (depth) {
        depth.minFilter = THREE.NearestFilter
        depth.generateMipmaps = false
        spMesh.current!.material.displacementMap = depth
      })

      loading.onLoad = () => {
        scene.current!.add(spMesh.current!)
      }

      renderer.current = new THREE.WebGLRenderer({ antialias: true })

      renderer.current.setPixelRatio(window.devicePixelRatio)

      renderer.current.setSize(container.clientWidth, h)
      // renderer.useLegacyLights = false
      target.appendChild(renderer.current.domElement)

      // 定义监听事件
      window.addEventListener('resize', handleResize, false)

      height = container.scrollHeight // h
      // 当前
      height -= container.clientHeight || 0

      // container!.addEventListener('scroll', handleScroll, false)
    }
  }

  const handleResize = () => {
    if (camera.current) {
      let container = document.querySelector('.container') as HTMLDivElement

      // let _root = document.querySelector('#main') as HTMLDivElement

      // console.log('_root = ', _root.getBoundingClientRect())

      let { width, height: h } = container!.getBoundingClientRect()

      // height = h
      height = container.scrollHeight
      // 当前
      height -= container.clientHeight || 0

      // 当window resize 后 刷新 摄像机视锥体的长宽比
      // camera!.aspect = window.innerWidth / window.innerHeight
      camera.current!.aspect = width / h
      camera.current?.updateProjectionMatrix?.()
      // 更新渲染器大小
      renderer.current!.setSize(container.clientWidth, h)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (spMesh.current) {
      let scrollAmount = e.currentTarget!.scrollTop
      scrollAmount = scrollAmount / height
      scrollAmount *= Math.PI * 2
      spMesh.current.rotation.y = scrollAmount

      spMesh.current.position.y = Math.sin(scrollAmount * 2)
      spMesh.current.position.x = Math.sin(scrollAmount * 2) * 2
    }
  }

  const animate = () => {
    requestAnimationFrame(animate)
    render()
  }

  const render = () => {
    renderer.current!.render(scene.current!, camera.current!)
  }

  return (
    <Root className="container" onScroll={handleScroll}>
      <div className="skyBox" ref={elementRef}></div>
      <section>
        <div>
          <h1>three skyBox</h1>
        </div>
      </section>

      <section>
        <div></div>
      </section>
      <section>
        <div id="info">
          <h2>Reference & Texture</h2>
          <p>
            {/* <a
              href="https://threejs.org/examples/#webxr_vr_panorama_depth"
              target="_blank"
              rel="noopener"
            >
              three.js - panorama with depth
            </a> */}
            <br />
            Created by
            {/* <a href="https://orfleisher.com" target="_blank" rel="noopener">
              @juniorxsound
            </a> */}
            .
          </p>
          {/* <p>
            Panorama from
            <a href="https://krpano.com/examples/?depthmap" target="_blank" rel="noopener">
              krpano
            </a>
            .
          </p> */}
          <div className="sample_wrap">
            <div className="sample_img">
              <p>Panorama image</p>
              <img src="https://threejs.org/examples/textures/kandao3.jpg" className="img" />
            </div>
            <div className="sample_img">
              <p>Depth map</p>
              <img
                src="https://threejs.org/examples/textures/kandao3_depthmap.jpg"
                className="img"
              />
            </div>
          </div>
        </div>
      </section>
    </Root>
  )
}

export default Sky
