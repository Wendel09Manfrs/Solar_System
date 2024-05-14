import * as THREE from 'three'

import { Entity } from './entity.js'
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js'

import solReflexTextura from '../../../assets/cenario/hexangle.png'
import solRaiosTextura2 from '../../../assets/cenario/sunFlare.jpg'

import fragmentCube from '../../../shaders/noisesCube/fragment.glsl'

import vertexCube from '../../../shaders/noisesCube/vertex.glsl'

import fragmentAround from '../../../shaders/noisesSunAround/fragment.glsl'

import vertexAround from '../../../shaders/noisesSunAround/vertex.glsl'

import { scene } from '../script'

export class Star extends Entity {
  constructor(
    position,
    size,
    texture,
    radiusOrbit,
    inclinRot,
    inclinOrbit,
    velTrans,
    velRot,
    excentricidade,
    label,
  ) {
    super(
      position,
      size,
      texture,
      radiusOrbit,
      inclinRot,
      inclinOrbit,
      velTrans,
      velRot,
      excentricidade,
      label,
    )
    this.addTexture()
    this.initElements(scene)
  }
  initElements(scene) {
    this.pointLight = new THREE.PointLight(0xffffff, 3.5, 100000, 5e-2)

    this.pointLight.position.copy(this.mesh.position)
    this.mesh.add(this.pointLight)
    scene.add(this.pointLight)

    this.matAround = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: vertexAround,
      fragmentShader: fragmentAround,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      side: THREE.FrontSide,
    })

    this.geoAround = new THREE.SphereGeometry(this.size * 1.5, 64, 64)
    this.meshAround = new THREE.Mesh(this.geoAround, this.matAround)
    scene.add(this.meshAround)
    this.mesh.add(this.meshAround)

    this.lensFlare = new Lensflare()
    this.lensFlare.position.copy(this.meshAround.position)

    this.textureLoaderFlare = new THREE.TextureLoader(loading.loadingManager)

    this.textureFlare1 = this.textureLoaderFlare.load(solRaiosTextura2)
    this.textureFlare2 = this.textureLoaderFlare.load(solReflexTextura)

    this.lensFlare.addElement(
      new LensflareElement(
        this.textureFlare1,
        300,
        0,
        new THREE.Color(0xffffff),
      ),
    )
    this.lensFlare.addElement(new LensflareElement(this.textureFlare2, 60, 0.4))
    this.mesh.add(this.lensFlare)
    scene.add(this.lensFlare)
    this.updateElementsPosition()
  }

  updateElementsPosition() {
    this.pointLight.position.copy(this.mesh.position)
    this.lensFlare.position.copy(this.mesh.position)
  }

  updateLensflare(camera) {
    var distancia = camera.position.distanceTo(this.lensFlare.position)

    if (distancia > 1.5e7) {
      this.lensFlare.visible = false
    } else {
      this.lensFlare.visible = true
    }
  }

  addTexture() {
    this.sceneCube = new THREE.Scene()
    this.cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      antialias: true,
      logarithmicDepthBuffer: true,
    })

    this.cubeCamera1 = new THREE.CubeCamera(0.01, 150, this.cubeRenderTarget1)

    this.matCube = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertexCube,
      fragmentShader: fragmentCube,
    })

    this.geoCube = new THREE.SphereGeometry(this.size, 64, 64)
    this.meshCube = new THREE.Mesh(this.geoCube, this.matCube)

    this.sceneCube.add(this.meshCube)
  }

  update(camera, clock, renderer) {
    this.updateLensflare(camera)
    this.updateElementsPosition()
    var elapsedTime = clock.getElapsedTime()
    this.cubeCamera1.update(renderer, this.sceneCube)
    this.mat.uniforms.uPerlin.value = this.cubeRenderTarget1.texture
    this.mat.uniforms.time.value = elapsedTime * 5e-3
    this.matCube.uniforms.time.value = elapsedTime * 5e-3
  }
}
