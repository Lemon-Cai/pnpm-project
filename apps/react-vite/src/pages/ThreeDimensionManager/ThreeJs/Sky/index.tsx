/*
 * @Author: CP
 * @Date: 2024-07-26 14:18:20
 * @Description:
 */
import { useEffect, useRef } from 'react'

import * as THREE from 'three'
import styled from 'styled-components'

import useMounted from '@/hooks/useMounted'

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const img_base = 'https://threejs.org/examples/textures/kandao3.jpg'
//let img_base = "https://happy358.github.io/Images/HDR/sunny_vondelpark_4k.jpg";
const img_depth = 'https://threejs.org/examples/textures/kandao3_depthmap.jpg'

const Sky = () => {
  const elementRef = useRef<HTMLDivElement>(null)

  // 场景
  let scene = useRef<THREE.Scene>().current
  let camera = useRef<THREE.PerspectiveCamera>().current
  let renderer = useRef<THREE.WebGLRenderer>().current
  let spMesh = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>().current
  let height = useRef<number>(0).current

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line
  }, [])
  useMounted(() => {
    if (elementRef.current) {
      init(elementRef.current)
      animate()
    }
  })

  const init = (target: HTMLDivElement) => {
    if (target) {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x101010)

      // 雾
      // scene.fog = new THREE.Fog(0x101010, 200, 1000);
      // 设置光源
      const light = new THREE.AmbientLight(0x404040, 2)
      scene.add(light)

      // 初始化相机
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      // 设置方向
      // camera.lookAt(0, 0, 0)
      scene.add(camera)

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
      spMesh = new THREE.Mesh(spGeometry, spMaterial)
      // 加入场景
      // scene.add(spMesh)

      // loading
      let loading = new THREE.LoadingManager()

      let loader = new THREE.TextureLoader(loading)

      loader.load(img_base, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.NearestFilter
        texture.generateMipmaps = false
        spMesh!.material!.map = texture
      })

      loader.load(img_depth, function (depth) {
        depth.minFilter = THREE.NearestFilter
        depth.generateMipmaps = false
        spMesh!.material.displacementMap = depth
      })

      loading.onLoad = () => {
        scene!.add(spMesh!)
      }

      renderer = new THREE.WebGLRenderer({ antialias: true })

      renderer.setPixelRatio(window.devicePixelRatio)

      let { width, height: h } = target.getBoundingClientRect()
      renderer.setSize(width, h)
      // renderer.useLegacyLights = false
      target.appendChild(renderer.domElement)

      // 定义监听事件
      window.addEventListener("resize", handleResize, false)

      height = h;
      height -= window.innerHeight;

      window.addEventListener('scroll', handleScroll)
    }
  }

  const handleResize = () => {
    let { width, height: h } = elementRef.current!.getBoundingClientRect()

    height = h;
    height -= window.innerHeight;

    // 当window resize 后 刷新 摄像机视锥体的长宽比
    camera!.aspect = window.innerWidth / window.innerHeight;
    camera?.updateProjectionMatrix?.();
    // 更新渲染器大小
    renderer!.setSize(width, h);
  }

  const handleScroll = () => {
    if (spMesh) {
      let scrollAmount = window.pageYOffset;
      scrollAmount = scrollAmount / height;
      scrollAmount *= Math.PI * 2;      
      spMesh.rotation.y = scrollAmount;
  
      spMesh.position.y = Math.sin(scrollAmount * 2);
      spMesh.position.x = Math.sin(scrollAmount * 2) * 2;
    }
  }

  const animate = () => {
    requestAnimationFrame(animate)
    render()
  }

  const render = () => {
    renderer!.render(scene!, camera!)
  }

  return <Root ref={elementRef}></Root>
}

export default Sky
