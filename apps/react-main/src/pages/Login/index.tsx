import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { GUI } from 'dat.gui'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

// import _random from 'lodash/random'
// import useMount from '../../hooks/useMount'
import LoginBg from '../../assets/images/login_bg.jpg'
// import sky from '../../assets/images/sky.png'
// import EarthBg from '../../assets/images/earth_bg.png'
import './index.scss'

const Login: React.FC = () => {
  const threeContainerRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line
  const [state, setState] = useState<{
    scene: THREE.Scene | null
    camera: THREE.Camera | null
    renderer: THREE.Renderer | null
    [key: string]: any
  }>({
    scene: null, // 场景
    camera: null, // 相机
    renderer: null, // 渲染器
    depth: 1400, // 盒模型的深度
    cameraTarget: new THREE.Vector3(0, 0, 0), // 声明相机目标点
    zAxisNumber: 0, // 声明相机在z轴的位置
    materials: [], // 声明点材质
    parameters: null, // 声明点的参数
    zprogress: 0, // 声明点在z轴上移动的进度
    zprogress_second: 0, // 声明同上（第二个几何点）
    particles_first: [], // 粒子1
    particles_second: [], // 
    particles_init_position: 0, // 声明粒子1的初始化位置
    cloudParameter_first: null, // 声明流动的云对象1（包含路径、云实例）
    cloudParameter_second: null, // 声明流动的云对象2（包含路径、云实例）
    renderCloudMove_first: null, // 声明云流动的渲染函数1
    renderCloudMove_second: null, // 声明云流动的渲染函数2
    // 声明性能监控
    stats: new Stats(),

    gui: new GUI(),

    width: 0,
    height: 0
  })

  useEffect(() => {
    console.log(threeContainerRef.current)
    if (threeContainerRef.current && !state.scene && !state.renderFlag) {
      state.renderFlag = true
      const { clientWidth, clientHeight } = threeContainerRef.current
      state.width = clientHeight
      state.height = clientHeight
      // test(clientWidth, clientHeight)
      state.scene = initScene()
      initMesh(clientWidth, clientHeight)

      const distance = clientWidth / 2 / Math.tan(Math.PI / 12)
      state.zAxisNumber = Math.floor(distance - state.depth / 2)

      state.camera = initCamera(clientWidth, clientHeight)
      initLight(state.scene)


      // state.sphere = initSphereModal()
      // initSphereGroup(state.sphere)
      

      // state.particles_init_position = -state.zAxisNumber - state.depth / 2
      // state.zprogress = state.particles_init_position
      // state.zprogress_second = state.particles_init_position * 2
      // state.particles_first = initSceneStar(state.particles_init_position, clientWidth, clientHeight)
      // state.particles_second = initSceneStar(state.zprogress_second, clientWidth, clientHeight)
      // state.cloudParameter_first = initTubeRoute(
      //   [
      //     new THREE.Vector3(-clientWidth / 10, 0, -state.depth / 2),
      //     new THREE.Vector3(-clientWidth / 4, clientHeight / 8, 0),
      //     new THREE.Vector3(-clientWidth / 4, 0, state.zAxisNumber)
      //   ],
      //   400,
      //   200
      // )
      // state.cloudParameter_second = initTubeRoute(
      //   [
      //     new THREE.Vector3(clientWidth / 8, clientHeight / 8, -state.depth / 2),
      //     new THREE.Vector3(clientWidth / 8, clientHeight / 8, state.zAxisNumber)
      //   ],
      //   200,
      //   100
      // )
      state.renderer = initRenderer(clientWidth, clientHeight)

      
      // 控制器必须放在renderer函数后面
      // initOrbitControls()
      animate()
      // setState((prev) => ({
      //   ...prev,
      //   scene,
      //   camera,
      //   renderer,
      // }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const test = (width: number, height: number) => {
  //   // 创建3D场景对象Scene
  //   const scene = new THREE.Scene()

  //   //创建一个长方体几何对象Geometry
  //   const geometry = new THREE.BoxGeometry(100, 100, 100)
  //   //创建一个材质对象Material
  //   const material = new THREE.MeshBasicMaterial({
  //     color: 0xff0000, //0xff0000设置材质颜色为红色
  //   })

  //   // 两个参数分别为几何体geometry、材质material
  //   const mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
  //   //设置网格模型在三维空间中的位置坐标，默认是坐标原点
  //   mesh.position.set(0, 10, 0)
  //   scene.add(mesh)
  //   // 实例化一个透视投影相机对象
  //   const camera = new THREE.PerspectiveCamera()
  //   //相机在Three.js三维坐标系中的位置
  //   // 根据需要设置相机位置具体值
  //   camera.position.set(200, 200, 200)
  //   //相机观察目标指向Threejs 3D空间中某个位置
  //   camera.lookAt(0, 0, 0) //坐标原点
  //   // 创建渲染器对象
  //   const renderer = new THREE.WebGLRenderer()
  //   // 定义threejs输出画布的尺寸(单位:像素px)
  //   renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)
  //   renderer.render(scene, camera) //执行渲染操作
  //   // document.body.appendChild(renderer.domElement);
  //   threeContainerRef.current?.appendChild(renderer.domElement)
  // }

  // React 18 严格模式下 会执行两次，要改造
  // useMount(() => {
  //   console.log(threeContainerRef.current);
  // })

  // 初始化场景
  const initScene = () => {
    // 创建场景
    // https://threejs.org/docs/#api/zh/scenes/Scene
    let scene = new THREE.Scene()
    // https://threejs.org/docs/#api/zh/scenes/Fog
    // 为场景添加线性雾效果
    // Fog(color: THREE.ColorRepresentation, near?: number | undefined, far?: number | undefined)
    scene.fog = new THREE.Fog(0x000000, 0, 10000)
    return scene
  }

  // 初始化几何体、材质 、网格并添加到场景中
  const initMesh = async (
    width: number,
    height: number
  ) => {
    // https://threejs.org/docs/#api/zh/loaders/TextureLoader
    const texture = new THREE.TextureLoader().load(
      LoginBg,
      // sky,
      (texture) => {
        
      },
      // (event) => {
      //   console.log(event)
      // },
      // (error) => {
      //   console.log(error)
      // }
    )
    // https://threejs.org/docs/#api/zh/geometries/BoxGeometry
    // BoxGeometry(width, height, depth) = BoxGeometry(x, y, z) 立体坐标轴的三个方向
    const geometry = new THREE.BoxGeometry(width / 2, height / 2, state.depth)

    const material = new THREE.MeshBasicMaterial({map: texture})

    // 把创建的几何体、材质，放到网格中
    const mesh = new THREE.Mesh(geometry, material)

    // mesh.position.set(0, 0, 0)
    // 添加到场景中
    state.scene?.add(mesh)
    return mesh
  }

  // 初始化轨道控制器
  // const initOrbitControls = () => {
  //   if(state.camera && state.renderer) {
  //     const controls = new OrbitControls(state.camera, state.renderer.domElement)
  //     // enabled设置为true是可以使用鼠标控制视角
  //     controls.enabled = false
  //     controls.update()
  //   }
  // }

  // 初始化相机
  const initCamera = (width: number, height: number) => {
    /**
     * 方式1：固定视野的距离，求满足完整的视野画面需要多大的视域角度
     * tan正切值（直角边除以临边）
     * const mathTan_value = width / 2 / depth
     * 视域角度
     * const fov_angle = (Math.atan(mathTan_value) * 180) / Math.PI
     * 创建透视相机
     * new THREE.PerspectiveCamera(fov_angle, width / height, 1, depth)
     * 场景是一个矩形容器（坐标(0, 0, 0)是矩形容器的中心），相机能看到的距离是depth，
     * camera.position.set(0, 0, depth / 2)
     */

    /**
     * 使用透视相机
     * 参数值分别是：
     * fov（field of view） — 摄像机视锥体垂直视野角度
     * aspect — 摄像机视锥体长宽比
     * near — 摄像机视锥体近端面
     * far — 摄像机视锥体远端面
     * 这里需要注意：透视相机是鱼眼效果，如果视域越大，边缘变形越大。
     * 为了避免边缘变形，可以将fov角度设置小一些，距离拉远一些
     */

    /**
     * 方式2:固定视域角度，求需要多少距离才能满足完整的视野画面
     * 15度等于(Math.PI / 12)
     */

    const fov = 15
    const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 30000)

    camera.position.set(0, 0, state.zAxisNumber)
    camera.lookAt(state.cameraTarget)

    return camera
  }

  //光源
  const initLight = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    // 右下角点光源
    const light_rightBottom = new THREE.PointLight(0x0655fd, 5, 0)
    light_rightBottom.position.set(0, 100, -200)
    scene.add(light_rightBottom)
    scene.add(ambientLight)
  }

  
  // // 初始化球体模型
  // const initSphereModal = () => {
  //   //材质
  //   let material = new THREE.MeshPhongMaterial()
  //   material.map = new THREE.TextureLoader().load(EarthBg)
  //   material.blendDstAlpha = 1
  //   //几何体
  //   let sphereGeometry = new THREE.SphereGeometry(50, 64, 32)
  //   //模型
  //   return new THREE.Mesh(sphereGeometry, material)
  // }

  // // 初始化组 --- 球体
  // const initSphereGroup = (sphere: THREE.Mesh) => {
  //   state.Sphere_Group = new THREE.Group()
  //   state.Sphere_Group.add(sphere)
  //   state.Sphere_Group.position.x = -400
  //   state.Sphere_Group.position.y = 200
  //   state.Sphere_Group.position.z = -200
    
  //   state.scene?.add(state.Sphere_Group)
  // }

  //   // 初始化流动路径
  //   const initTubeRoute = (route?: any, geometryWidth?: number, geometryHeigh?: number) => {
  //     const curve = new THREE.CatmullRomCurve3(route, false)
  //     const tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 50, false)
  //     const tubeMaterial = new THREE.MeshBasicMaterial({
  //       // color: '0x4488ff',
  //       opacity: 0,
  //       transparent: true
  //     })
  //     const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
  //     state.scene?.add(tube)

  //     const clondGeometry = new THREE.PlaneGeometry(geometryWidth, geometryHeigh)
  //     const textureLoader = new THREE.TextureLoader()
  //     const cloudTexture = textureLoader.load(require('../../assets/images/cloud.png'))
  //     const clondMaterial = new THREE.MeshBasicMaterial({
  //       map: cloudTexture,
  //       blending: THREE.AdditiveBlending,
  //       depthTest: false,
  //       transparent: true
  //     })
  //     const cloud = new THREE.Mesh(clondGeometry, clondMaterial)
  //     state.scene?.add(cloud)
  //     return {
  //       cloud,
  //       curve
  //     }
  //   }

  //   // 初始化场景星星效果
  //   const initSceneStar = (initZposition: number, width: number, height: number): any => {
  //     const geometry = new THREE.BufferGeometry()
  //     const vertices: number[] = []
  //     const pointsGeometry: any[] = []
  //     const textureLoader = new THREE.TextureLoader()
  //     const sprite1 = textureLoader.load(require('../..//assets/images/starflake1.png'))
  //     const sprite2 = textureLoader.load(require('../../assets/images/starflake2.png'))
  //     state.parameters = [
  //       [[0.6, 100, 0.75], sprite1, 50],
  //       [[0, 0, 1], sprite2, 20]
  //     ]
  //     // 初始化500个节点
  //     for (let i = 0; i < 500; i++) {
  //       /**
  //        * const x: number = Math.random() * 2 * width - width
  //        * 等价
  //        * THREE.MathUtils.randFloatSpread(width)
  //        */
  //       const x: number = THREE.MathUtils.randFloatSpread(width)
  //       const y: number = _random(0, height / 2)
  //       const z: number = _random(-state.depth / 2, state.zAxisNumber)
  //       vertices.push(x, y, z)
  //     }

  //     geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

  //     // 创建2种不同的材质的节点（500 * 2）
  //     for (let i = 0; i < state.parameters.length; i++) {
  //       const color = state.parameters[i][0]
  //       const sprite = state.parameters[i][1]
  //       const size = state.parameters[i][2]

  //       state.materials[i] = new THREE.PointsMaterial({
  //         size,
  //         map: sprite,
  //         blending: THREE.AdditiveBlending,
  //         depthTest: true,
  //         transparent: true
  //       })
  //       state.materials[i].color.setHSL(color[0], color[1], color[2])
  //       const particles = new THREE.Points(geometry, state.materials[i])
  //       particles.rotation.x = Math.random() * 0.2 - 0.15
  //       particles.rotation.z = Math.random() * 0.2 - 0.15
  //       particles.rotation.y = Math.random() * 0.2 - 0.15
  //       particles.position.setZ(initZposition)
  //       pointsGeometry.push(particles)
  //       state.scene?.add(particles)
  //     }
  //     return pointsGeometry
  //   }

  //   // 渲染星球的自转
  //   const renderSphereRotate = () => {
  //     if (state.sphere) {
  //       state.Sphere_Group.rotateY(0.001)
  //     }
  //   }

  //   // 渲染星星的运动
  //   const renderStarMove = () => {
  //     const time = Date.now() * 0.00005
  //     state.zprogress += 1
  //     state.zprogress_second += 1

  //     if (state.zprogress >= state.zAxisNumber + state.depth / 2) {
  //       state.zprogress = state.particles_init_position
  //     } else {
  //       state.particles_first.forEach((item: any) => {
  //         item.position.setZ(state.zprogress)
  //       })
  //     }
  //     if (state.zprogress_second >= state.zAxisNumber + state.depth / 2) {
  //       state.zprogress_second = state.particles_init_position
  //     } else {
  //       state.particles_second.forEach((item: any) => {
  //         item.position.setZ(state.zprogress_second)
  //       })
  //     }

  //     for (let i = 0; i < state.materials.length; i++) {
  //       const color = state.parameters[i][0]

  //       const h = ((360 * (color[0] + time)) % 360) / 360
  //       state.materials[i].color.setHSL(color[0], color[1], parseFloat(h.toFixed(2)))
  //     }
  //   }

  //   // 初始化云的运动函数
  //   const initCloudMove = (
  //     cloudParameter: any,
  //     speed: number,
  //     scaleSpeed = 0.0006,
  //     maxScale = 1,
  //     startScale = 0
  //   ) => {
  //     let cloudProgress = 0
  //     return () => {
  //       if (startScale < maxScale) {
  //         startScale += scaleSpeed
  //         cloudParameter.cloud.scale.setScalar(startScale)
  //       }
  //       if (cloudProgress > 1) {
  //         cloudProgress = 0
  //         startScale = 0
  //       } else {
  //         cloudProgress += speed
  //         if (cloudParameter.curve) {
  //           const point = cloudParameter.curve.getPoint(cloudProgress)
  //           if (point && point.x) {
  //             cloudParameter.cloud.position.set(point.x, point.y, point.z)
  //           }
  //         }
  //       }
  //     }
  //   }

  // 初始化渲染器
  const initRenderer = (width: number, height: number) => {
    // 开启抗锯齿
    // 在 css 中设置背景色透明显示渐变色
    const renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true })
    let pixel = window.devicePixelRatio
    console.log(pixel, 'pixel');
    renderer.setPixelRatio(pixel)
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // TODO:
    threeContainerRef.current?.appendChild(renderer.domElement)

    // threeContainerRef.current?.appendChild(state.stats.dom)
    // state.renderCloudMove_first = initCloudMove(state.cloudParameter_first, 0.0002)
    // state.renderCloudMove_second = initCloudMove(state.cloudParameter_second, 0.0008, 0.001)

    return renderer
  }

  //动画刷新
  const animate = () => {
    requestAnimationFrame(animate)
    // renderSphereRotate()
    // renderStarMove()
    // state.renderCloudMove_first()
    // state.renderCloudMove_second()
    state.renderer?.render(state.scene!, state.camera!)
  }


  return (
    <div className='login-container'>
      <div ref={threeContainerRef} id='login-three-container'></div>
      <div className='login-form'></div>
    </div>
  )
}

export default Login
