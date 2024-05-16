import * as THREE from 'three'

import discVertex from '../../../shaders/disc/vertex.glsl'
import discFragment from '../../../shaders/disc/fragment.glsl'
import distortionHoleVertex from '../../../shaders/distortionHole/vertex.glsl'
import distortionHoleFragment from '../../../shaders/distortionHole/fragment.glsl'

import distortionDiscVertex from '../../../shaders/distortionDisc/vertex.glsl'
import distortionDiscFragment from '../../../shaders/distortionDisc/fragment.glsl'

import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

import { sceneManager } from '../script'

export class WhiteHole {
  constructor(size, label, pos) {
    this.scene = sceneManager.scene
    this.camera = sceneManager.camera
    this.pos = pos
    this.size = size
    this.label = label

    this.angleBlackHole = -THREE.MathUtils.degToRad(150.2)

    this.createGradient()
    this.createMesh(sceneManager)
    this.createDistortion(sceneManager)
    this.posLabel = new THREE.Vector3()
  }

  createGradient() {
    this.gradient = {}
    this.gradient.canvas = document.createElement('canvas')
    this.gradient.canvas.width = 1
    this.gradient.canvas.height = 128
    this.gradient.context = this.gradient.canvas.getContext('2d')
    this.gradient.style = this.gradient.context.createLinearGradient(
      0,
      0,
      0,
      this.gradient.canvas.height,
    )
    this.gradient.style.addColorStop(0, '#FFFFFF')
    this.gradient.style.addColorStop(0.1, '#AFEEEE')
    this.gradient.style.addColorStop(0.2, '#E6E6FA')
    this.gradient.style.addColorStop(0.4, '#D8BFD8')
    this.gradient.style.addColorStop(0.8, '#FAEBD7')

    this.gradient.context.fillStyle = this.gradient.style
    this.gradient.context.fillRect(
      0,
      0,
      this.gradient.canvas.width,
      this.gradient.canvas.height,
    )
    this.gradient.texture = new THREE.CanvasTexture(this.gradient.canvas)
  }

  createMesh(sceneManager) {
    this.geometry = new THREE.CylinderGeometry(0.1, 6, 0, 64, 8, true)
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader: discVertex,
      fragmentShader: discFragment,
      uniforms: {
        uTime: { value: 0 },
        uGradientTexture: { value: this.gradient.texture },
        uNoisesTexture: { value: sceneManager.noises.renderTarget.texture },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: true,
      depthTest: true,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.scene.add(this.mesh)

    const innerGeometry = new THREE.CylinderGeometry(0.1, 0.4, 0, 64)
    const innerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial)
    innerMesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.scene.add(innerMesh)

    this.div = document.createElement('div')
    this.div.className = 'label'
    this.div.textContent = this.label
    this.div.style.backgroundColor = 'transparent'

    this.label = new CSS2DObject(this.div)
    this.label.position.set(0, this.size * 1.1, 0)
    this.label.center.set(0, 1)
    this.mesh.add(this.label)
    this.label.layers.set(0)
  }

  createDistortion() {
    const angle1 = Math.atan2(this.camera.position.x, this.camera.position.z)
    const angleDeg = -THREE.MathUtils.radToDeg(angle1)

    this.distortion = {}
    this.distortion.scene = new THREE.Scene()

    this.distortion.hole = {}
    this.distortion.hole.geometry = new THREE.PlaneGeometry(
      this.size,
      this.size,
    )
    this.distortion.hole.material = new THREE.ShaderMaterial({
      vertexShader: distortionHoleVertex,
      fragmentShader: distortionHoleFragment,
      depthTest: true,
      depthWrite: false,
      blending: THREE.NoBlending,
    })

    this.distortion.hole.mesh = new THREE.Mesh(
      this.distortion.hole.geometry,
      this.distortion.hole.material,
    )
    this.distortion.hole.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.distortion.scene.add(this.distortion.hole.mesh)

    this.distortion.disc = {}
    this.distortion.disc.geometry = new THREE.CircleGeometry(79.0734)
    this.distortion.disc.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader: distortionDiscVertex,
      fragmentShader: distortionDiscFragment,
      blending: THREE.NoBlending,
      depthTest: true,
      depthWrite: true,
      uniforms: {
        angle: { value: angleDeg },
      },
    })

    this.distortion.disc.mesh = new THREE.Mesh(
      this.distortion.disc.geometry,
      this.distortion.disc.material,
    )
    this.distortion.disc.mesh.rotation.x = Math.PI * 0.5
    this.distortion.disc.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.distortion.scene.add(this.distortion.disc.mesh)
  }

  update(time) {
    this.material.uniforms.uTime.value = time
  }

  labelVisible(camera, checkedL) {
    this.mesh.getWorldPosition(this.posLabel)
    const distance =  camera.position.distanceTo(this.posLabel)
  
    if (checkedL) {
        if(distance<1000){
        this.showLabel = true;}
        else{
         this.showLabel = false; 
        }
      }
  
    this.label.visible = this.showLabel
  }
  applyGravitation(grav,camera) {
    const distanceHole = camera.position.distanceTo(this.pos)

    if (distanceHole < 1000) {
      const repulsionForce = Math.min(10, grav / distanceHole);

      const repulsionDirection = new THREE.Vector3()
        .copy(camera.position)
        .sub(this.pos)
        .normalize()

      camera.position.add(repulsionDirection.multiplyScalar(repulsionForce))
    }
  }
}
