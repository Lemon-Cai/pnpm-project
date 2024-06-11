import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const WIDTH = 256
const HEIGHT = 256

export const init = (() => {
  let renderer, camera, scene, controls, stats

  let target

  let rain

  let material

  let time = 0

  let plane, box, depthScene, orthCamera

  const clock = new THREE.Clock()

  function init(container) {
    // 初始化相机的位置， 实例化一个透视投影相机对象
    // 50:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
    // PerspectiveCamera( fov, aspect, near, far )
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 3000)
    camera.position.set(0, 200, 600) // 相机的位置

    scene = new THREE.Scene()
    scene.background = new THREE.Color('skyblue')

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    if (container instanceof HTMLElement) {
      container.appendChild(renderer.domElement)
    } else {
      // root
      const root = document.querySelector('#main')
      root.appendChild(renderer.domElement)
    }

    box = new THREE.Box3(new THREE.Vector3(-200, 0, -200), new THREE.Vector3(200, 200, 200))

    rain = createRain()

    plane = createPlane()

    createDepth()

    let axesHelper = new THREE.AxesHelper(5000)
    scene.add(axesHelper)

    stats = new Stats()
    stats.domElement.style.position = 'absolute'

    if (container instanceof HTMLElement) {
      container.appendChild(stats.domElement)
    } else {
      // root
      const root = document.querySelector('#main')
      root.appendChild(stats.domElement)
    }

    controls = new OrbitControls(camera, renderer.domElement)

    console.log('rain = ', rain, 'controls = ', controls)

    window.addEventListener('resize', handleWindowResize, false)
  }

  function createRain() {
    //创建雨
    material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    })

    material.onBeforeCompile = function (shader, renderer) {
      const getFoot = `
          attribute vec3 pos;
          uniform float top;
          uniform float bottom;
          uniform float time;
          uniform mat4 cameraMatrix;
          varying float depth;
          varying vec2 depthUv;
          #include <common>
          float angle(float x, float y){
              return atan(y, x);  
          }

          // 计算更新过后的顶点坐标的偏移
          vec2 getFoot(vec2 camera,vec2 _n_pos,vec2 pos){
              vec2 position;

              float distanceLen = distance(pos, _n_pos);

              float a = angle(camera.x - _n_pos.x, camera.y - _n_pos.y);

              pos.x > _n_pos.x ? a -= 0.785 : a += 0.785; 

              position.x = cos(a) * distanceLen;
              position.y = sin(a) * distanceLen;
              
              return position + _n_pos;
          }
          `
      const begin_vertex = `

          float height = top - bottom;

          vec3 _n_pos = vec3(pos.x, pos.y- height/30.,pos.z);

          vec2 foot = getFoot(vec2(cameraPosition.x, cameraPosition.z),  vec2(_n_pos.x, _n_pos.z), vec2(position.x, position.z));

          // 模拟雨滴下落位置。Bottom -> Bottom + Height 是雨滴下落空间。
          float y = _n_pos.y - bottom - height * fract(time);
          y += y < 0.0 ? height : 0.0;
          
          // 雨滴下落的百分比，即是雨滴的深度。 [0,1] 空间
          depth = (1.0 - y / height) ;

          // 更新顶点位置
          y += bottom;
          y += position.y - _n_pos.y;
          vec3 transformed = vec3( foot.x, y, foot.y );

          // 将顶点坐标与正交相机的投影矩阵的逆矩阵进行运算，得到顶点坐标在 [-1,1] 三维空间的数据。
          vec4 cameraDepth = cameraMatrix * vec4(transformed, 1.0);

          // 采样 uv
          depthUv = cameraDepth.xy/2.0 + 0.5;
          `

      const depth_vary = `
          uniform sampler2D tDepth;
          uniform float opacity;
          varying float depth;
          varying vec2 depthUv;

          float decodeRGBA2Float(vec4 rgba)
          {
              return dot(rgba, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));
          }
          `

      const depth_frag = `
            // 对比深度值，如果深度值满足关系，不进行渲染。
            if(1.0 - depth < decodeRGBA2Float(texture2D( tDepth, depthUv ))) discard;
            vec4 diffuseColor = vec4( diffuse, opacity );
          `
      shader.vertexShader = shader.vertexShader.replace('#include <common>', getFoot)
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', begin_vertex)
      shader.fragmentShader = shader.fragmentShader.replace('uniform float opacity;', depth_vary)
      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        depth_frag
      )

      shader.uniforms.cameraPosition = {
        value: new THREE.Vector3(0, 200, 0)
      }
      shader.uniforms.top = {
        value: box.max.y
      }
      shader.uniforms.bottom = {
        value: box.min.y
      }
      shader.uniforms.time = {
        value: 0
      }

      shader.uniforms.cameraMatrix = {
        value: new THREE.Matrix4()
      }
      shader.uniforms.tDepth = {
        value: target.texture
      }
      material.uniforms = shader.uniforms
    }

    const geometry = new THREE.BufferGeometry()

    const vertices = []
    const poses = []
    const uvs = []
    const indices = []

    for (let i = 0; i < 6000; i++) {
      const pos = new THREE.Vector3()
      pos.x = Math.random() * (box.max.x - box.min.x) + box.min.x
      pos.y = Math.random() * (box.max.y - box.min.y) + box.min.y
      pos.z = Math.random() * (box.max.z - box.min.z) + box.min.z

      const height = (box.max.y - box.min.y) / 15
      const width = height / 50

      vertices.push(
        pos.x + width,
        pos.y + height,
        pos.z,
        pos.x - width,
        pos.y + height,
        pos.z,
        pos.x - width,
        pos.y,
        pos.z,
        pos.x + width,
        pos.y,
        pos.z
      )

      poses.push(pos.x, pos.y, pos.z, pos.x, pos.y, pos.z, pos.x, pos.y, pos.z, pos.x, pos.y, pos.z)

      uvs.push(1, 1, 0, 1, 0, 0, 1, 0)

      indices.push(i * 4 + 0, i * 4 + 1, i * 4 + 2, i * 4 + 0, i * 4 + 2, i * 4 + 3)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    geometry.setAttribute('pos', new THREE.BufferAttribute(new Float32Array(poses), 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))

    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    return mesh
  }

  function createPlane() {
    const geometry = new THREE.PlaneGeometry(100, 400)
    geometry.rotateX(-Math.PI / 2)

    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }))
    mesh.position.y = 100
    scene.add(mesh)

    return mesh
  }

  //创建深度图
  function createDepth() {
    target = new THREE.WebGLRenderTarget(WIDTH, HEIGHT)
    target.texture.format = THREE.RGBAFormat
    target.texture.minFilter = THREE.NearestFilter
    target.texture.magFilter = THREE.NearestFilter
    target.texture.generateMipmaps = false

    const center = new THREE.Vector3()
    box.getCenter(center)

    // 正投影相机
    // OrthographicCamera( left, right, top, bottom, near, far )
    orthCamera = new THREE.OrthographicCamera(
      box.min.x - center.x,
      box.max.x - center.x,
      box.max.z - center.z,
      box.min.z - center.z,
      0.1,
      box.max.y - box.min.y
    )

    // orthCamera.left = box.min.x - center.x
    // orthCamera.right = box.max.x - center.x
    // orthCamera.top = box.max.z - center.z
    // orthCamera.bottom = box.min.z - center.z
    // orthCamera.near = 0.1
    // orthCamera.far = box.max.y - box.min.y

    orthCamera.position.copy(center)
    orthCamera.position.y += box.max.y - center.y
    orthCamera.lookAt(center)

    orthCamera.updateProjectionMatrix()
    orthCamera.updateWorldMatrix()

    const helper = new THREE.CameraHelper(orthCamera)
    scene.add(helper)

    depthScene = new THREE.Scene()

    depthScene.overrideMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying float color;
        void main () {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          color = gl_Position.z / 2.0 + 0.5;
        }
      `,
      fragmentShader: `
        varying float color;
          
        vec4 encodeFloat2RGBA(float v)
        {
            vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
            enc = fract(enc);
            enc -= enc.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
            return enc;
        }
        void main() {
            gl_FragColor = encodeFloat2RGBA(1.0 - color);
        }
      `
    })

    renderer.setRenderTarget(target)
    depthScene.children = [plane]
    renderer.render(depthScene, orthCamera)
    renderer.setRenderTarget(null)
  }

  function handleWindowResize() {
    // windowHalfX = window.innerWidth / 2;
    // windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function render() {
    time = clock.getElapsedTime() / 2

    if (material.uniforms) {
      material.uniforms.cameraPosition.value = camera.position
      material.uniforms.time.value = time
      material.uniforms.cameraMatrix.value = new THREE.Matrix4().multiplyMatrices(
        orthCamera.projectionMatrix,
        orthCamera.matrixWorldInverse
      )
    }

    renderer.render(scene, camera)
  }

  //
  function animate() {
    requestAnimationFrame(animate)

    render()
    stats.update()
  }

  return (container) => {
    init(container)
    animate()
  }
})()
