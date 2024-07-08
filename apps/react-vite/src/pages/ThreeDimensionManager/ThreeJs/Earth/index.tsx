/*
 * @Author: CP
 * @Date: 2024-06-28 17:28:42
 * @Description: 
 */
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import Page from '@/components/Page'

import './index.scss'

// 创建第一个threejs 案例
const Earth = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendered = useRef(false)
  // const [containerRef, setContainerRef] = useState(null)
  // const [state, setState] = useState({
  //   rendered: false
  // })
  useEffect(() => {
    console.log(222);
    if (!rendered.current && containerRef.current) {
      rendered.current = true
      // setState(prevState => ({
      //   ...prevState,
      //   rendered: true
      // }))
      initScene()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useLayoutEffect(() => {
  //   console.log(222);
  //   if (!state.rendered && containerRef.current) {
  //     state.rendered = true
  //     initScene()
  //   }
  // }, [])

  const initScene = () => {
    // eslint-disable-next-line
    // @ts-ignore
  let { clientHeight, clientWidth } = containerRef.current

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('skyblue')

    // 创建相机
    // const camera = new THREE.PerspectiveCamera(1, 1, 2, 1000)

    const fov = 35; // AKA Field of View
    const aspect = clientWidth / clientHeight;
    const near = 0.1; // the near clipping plane
    const far = 100; // the far clipping plane

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.set(0, 5, 10)

    // 创建几何体
    const geometry = new THREE.BoxGeometry(100, 100, 100)

    // 创建材质
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0, 255, 80),
    })

    // 创建网格
    const mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)

    //  创建个渲染器
    const renderer = new THREE.WebGL1Renderer()

    console.log('clientWidth, clientHeight', clientWidth, clientHeight);

    renderer.setSize(clientWidth, clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    containerRef.current?.appendChild(renderer.domElement)

    renderer.render(scene, camera)
  }

  return (
    <Page className='container'>
      <Page.Content>
        <div ref={containerRef} className='three-content'></div>
      </Page.Content>
    </Page>
  )
}

export default Earth
