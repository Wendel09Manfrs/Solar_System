import * as THREE from 'three'

import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import noisesVertex from '../../../shaders/noises/vertex.glsl'
import noisesFragment from '../../../shaders/noises/fragment.glsl'

import compositionVertex from '../../../shaders/composition/vertex.glsl'
import compositionFragment from '../../../shaders/composition/fragment.glsl'

import nx from '../../../assets/cenario/nx.png'
import ny from '../../../assets/cenario/ny.png'
import nz from '../../../assets/cenario/nz.png'
import px from '../../../assets/cenario/px.png'
import py from '../../../assets/cenario/py.png'
import pz from '../../../assets/cenario/pz.png'

import {
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

export class SceneManager {
    constructor() {
      this.canvas = document.querySelector('canvas.webgl')
      this.sizes = { width: window.innerWidth-20, height: window.innerHeight-20 }
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height, 1.2e-4, 5e9)
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: this.canvas,
        powerPreference: 'high-performance',
        logarithmicDepthBuffer: true,
      })

      this.orbitC = new OrbitControls(this.camera, this.canvas)

      this.fly = new FlyControls(this.camera, this.canvas)

      this.fly.movementSpeed = 10;

      this.camera.position.set(-1e10, 1e10, -1e10)

      this.camera.position.set(-7e8, 1e9, -5e9)

    }
  
    init() {
      
  
      this.renderer.setClearColor('#000000')
      this.createComposition()
      this.createNoises()
      this.createLabel()
      this.configRenderCompo()     

      this.orbitC.enablePan = true
      this.orbitC.enableRotate = true
      this.orbitC.enableZoom = true
      this.orbitC.enableDamping = true
      this.orbitC.dampingFactor = 0.25
      this.orbitC.minDistance = 1
      this.orbitC.maxDistance = 5e9

      this.fly.rollSpeed = 0.3;

      this.fly.autoForward = false;

      this.fly.dragToLook = false;
      this.fly.enabled = false;
    
  
      window.addEventListener('resize', () => {
        this.sizes.width = window.innerWidth - 20
        this.sizes.height = window.innerHeight - 20
        this.configRenderCompo()
      })
  
      document.body.appendChild(this.renderer.domElement)
  
      const cubeTextureLoader = new THREE.CubeTextureLoader(loading.loadingManager)
      this.scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])
  
      const ambientLight = new THREE.AmbientLight(0x99999999)
      this.scene.add(ambientLight)
    }
  
    configRenderCompo() {
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()
  
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
      this.renderer.setSize(this.sizes.width, this.sizes.height)
  
      this.composition.distortionRenderTarget.setSize(
        this.sizes.width * this.renderer.getPixelRatio(),
        this.sizes.height * this.renderer.getPixelRatio()
      )
  
      this.composition.defaultRenderTarget.setSize(
        this.sizes.width * this.renderer.getPixelRatio(),
        this.sizes.height * this.renderer.getPixelRatio()
      )
      this.labelRenderer.setSize( this.sizes.width - 20,  this.sizes.height - 20)   
    }
  
    createNoises() {
        this.noises = {}
      this.noises.scene = this.scene
      this.noises.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
      this.noises.camera.position.set(0, 0, 5)
      this.noises.scene.add(this.noises.camera)
  
      this.noises.plane = {}
      this.noises.plane.geometry = new THREE.PlaneGeometry(2, 2)
      this.noises.plane.material = new THREE.ShaderMaterial({
        vertexShader: noisesVertex,
        fragmentShader: noisesFragment,
        blending: THREE.NoBlending,
      })
      this.noises.plane.mesh = new THREE.Mesh(this.noises.plane.geometry, this.noises.plane.material)
      this.noises.scene.add(this.noises.plane.mesh)
  
      this.noises.renderTarget = new THREE.WebGLRenderTarget(256, 256, {
        generateMipmaps: false,
        type: THREE.FloatType,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        logarithmicDepthBuffer: true 
      })
  
      this.renderer.setRenderTarget(this.noises.renderTarget)
      this.renderer.render(this.noises.scene, this.noises.camera)
      this.renderer.setRenderTarget(null)

      return this.noises
    }
  
    createComposition() {
     
        this.composition = {}
      this.composition.defaultRenderTarget = new THREE.WebGLRenderTarget(
        this.sizes.width * this.renderer.getPixelRatio(),
        this.sizes.height * this.renderer.getPixelRatio(),
        { generateMipmaps: false,
          logarithmicDepthBuffer: true  }
        
      )
  
      this.composition.distortionRenderTarget = new THREE.WebGLRenderTarget(
        this.sizes.width * this.renderer.getPixelRatio(),
        this.sizes.height * this.renderer.getPixelRatio(),
        {
          generateMipmaps: false,
          logarithmicDepthBuffer: true 
          //format: THREE.RedFormat
        }
      )
      this.composition.scene = new THREE.Scene()
      this.composition.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
      this.composition.camera.position.set(0, 0, 5)
      this.composition.scene.add(this.composition.camera)
  
      this.composition.plane = {}
      this.composition.plane.geometry = new THREE.PlaneGeometry(2, 2)
      this.composition.plane.material = new THREE.ShaderMaterial({
        vertexShader: compositionVertex,
        fragmentShader: compositionFragment,
        uniforms: {
          uTime: { value: 0 },
          uDefaultTexture: { value: this.composition.defaultRenderTarget.texture },
          uDistortionTexture: { value: this.composition.distortionRenderTarget.texture },
          uConvergencePosition: { value: new THREE.Vector2() },
        },
        depthTest: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      this.composition.plane.mesh = new THREE.Mesh(this.composition.plane.geometry, this.composition.plane.material)
      this.composition.scene.add(this.composition.plane.mesh)
  
      return this.composition
    }
  
    updateComposition(deltaTime) {
      this.composition.plane.material.uniforms.uTime.value += deltaTime
    }

    createLabel(){
        this.labelRenderer = new CSS2DRenderer()
        this.labelRenderer.setSize( this.sizes.width - 20,  this.sizes.height - 20)
        this.labelRenderer.domElement.style.position = 'absolute'
        this.labelRenderer.domElement.style.top = '0px'
        this.labelRenderer.domElement.style.pointerEvents = 'none'
        document.body.appendChild(this.labelRenderer.domElement)
    }
    
    

}