import {Vector3, BufferGeometry, Float32BufferAttribute, Points,ShaderMaterial, TextureLoader} from 'three'

import { loading } from '../entities/entity.js'

import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

import vertexNebula from '../../../shaders/nebula/vertex.glsl'
import fragmentNebula from '../../../shaders/nebula/fragment.glsl'

import vertexAsteroids from '../../../shaders/asteroids/vertex.glsl'
import fragmentAsteroids from '../../../shaders/asteroids/fragment.glsl'

import { scene } from '../script.js'



export class Object {
  constructor(name, distCam, posLabel, attributes, blending, texture) {
    this.scene = scene
    this.attributes = attributes
    this.name = name
    this.distCam = distCam
    this.posLabel = posLabel
    this.texture = texture
    this.blending = blending

    this.objectGeometry = new BufferGeometry()

    this.objectGeometry.setAttribute(
      'color',
      new Float32BufferAttribute(
        this.attributes.colors.flatMap((c) => [c.r, c.g, c.b]),
        3,
      ),
    )

    this.objectGeometry.setAttribute(
      'shift',
      new Float32BufferAttribute(this.attributes.shift, 4),
    )

    this.objectGeometry.setAttribute(
      'sizes',
      new Float32BufferAttribute(this.attributes.sizes, 1),
    )

    this.objectGeometry.setAttribute(
      'position',
      new Float32BufferAttribute(
        this.attributes.coord.flatMap((v) => [v.x, v.y, v.z]),
        3,
      ),
    )

    this.particleTexture = new TextureLoader(loading.loadingManager).load(
      this.texture,
    )

    if (!texture) {
      this.pointMaterial = new ShaderMaterial({
        uniforms: {
          opacity: { value: 1.0 },
        },
        vertexShader: vertexNebula,
        fragmentShader: fragmentNebula,

        transparent: true,
        blending: this.blending,
        depthWrite: false,

      })
    } else {
      this.pointMaterial = new ShaderMaterial({
        uniforms: {
          particleTexture: { value: this.particleTexture },
          opacity: { value: 1.0 },
          time: { value: 0 },
        },
        vertexShader: vertexAsteroids,
        fragmentShader: fragmentAsteroids,

        transparent: true,
        blending: this.blending,
        depthWrite: true,
        depthTest: false,
      })
    }

    this.objects = new Points(this.objectGeometry, this.pointMaterial)

    this.div = document.createElement('div')
    this.div.className = 'label'
    this.div.textContent = this.name
    this.div.style.backgroundColor = 'transparent'

    this.label = new CSS2DObject(this.div)
    this.label.center.set(0, 1)
    this.objects.add(this.label)
    this.label.layers.set(0)

    this.label.position.copy(this.posLabel)
    this.scene.add(this.objects)
  }

  setLabelVisible(pos, camera, checkedL) {
    const posLabel = new Vector3()
    this.label.getWorldPosition(posLabel)
    const distance = camera.position.distanceTo(posLabel)
    const distCamCenter = camera.position.distanceTo(pos)
    const distLabelCenter = posLabel.distanceTo(pos)

    this.show =
      checkedL &&
      5 * distCamCenter > distance &&
      (distance < this.distCam || distLabelCenter > 1e7)

    this.label.visible = this.show
  }
}

export function pushShift(shift, amplitude) {
  shift.push(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    (Math.random() * 0.9 + 0.1) * Math.PI,
    Math.random() * amplitude - amplitude
  )
}
