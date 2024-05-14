import * as THREE from 'three'

import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'

import {Loading } from '../loading/loading'

export const loading = new Loading();

import earthNightTexture from '../../../assets/textures/earth_nightmap.jpg'

import earthSpecularTexture from '../../../assets/textures/earth_specular_map.png'

import fragmentSun from '../../../shaders/noisesSun/fragment.glsl'
import vertexSun from '../../../shaders/noisesSun/vertex.glsl'


import {scene } from '../script'

export class Entity {
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
      this.position = position
      this.size = size
      this.texture = texture
      this.radiusOrbit = radiusOrbit
      this.inclinRot = inclinRot
      this.inclinOrbit = inclinOrbit
      this.velTrans = velTrans
      this.velRot = velRot
      this.excentricidade = excentricidade
      this.label = label
  
      this.textureLoader = new THREE.TextureLoader(loading.loadingManager)
      this.geo = new THREE.SphereGeometry(this.size, 64, 64)
  
      if (this.label.toLowerCase() === 'sun') {
        this.mat = new THREE.ShaderMaterial({
          side: THREE.FrontSide, 
          uniforms: {
              time: {value: 0},
              uPerlin: { value: null },
              resolution: { value: new THREE.Vector4() }
          },
          vertexShader: vertexSun,
          fragmentShader: fragmentSun,
          blending: THREE.AlwaysDepth,
          depthTest: true,
          depthWrite: true,
          side: THREE.FrontSide,
      });
      } else {

        if (this.label.toLowerCase() === 'earth') {
        this.mat = new THREE.MeshPhongMaterial({
          map: this.textureLoader.load(this.texture),
          side: THREE.DoubleSide,
          //shadowSide: THREE.DoubleSide, 
          emissiveMap: this.textureLoader.load(earthNightTexture),
          emissive: new THREE.Color(0xaaaaaaaa),
          emissiveIntensity: 0.5,

          specularMap: this.textureLoader.load(earthSpecularTexture),
          specular: 1,
          shininess: 50,
    
        })
      } else{
        this.mat = new THREE.MeshPhongMaterial({
          map: this.textureLoader.load(this.texture),
          side: THREE.DoubleSide,
          bumpScale: 0.5,
          shadowSide: THREE.DoubleSide, 
          shininess: 0.5, 
        })
        
      }

      }
      this.mesh = new THREE.Mesh(this.geo, this.mat)
  
      this.div = document.createElement('div')
      this.div.className = 'label'
      this.div.textContent = this.label
      this.div.style.backgroundColor = 'transparent'
  
      this.label = new CSS2DObject(this.div)
      this.label.position.set(0,this.size*1.1, 0)
      this.label.center.set(0, 1)
      this.mesh.add(this.label)
      this.label.layers.set(0)
  
      
  
      this.mesh.position.x = this.radiusOrbit
  
      this.inclinaRad = (this.inclinRot * Math.PI) / 180.0
  
      this.mesh.rotation.x = this.inclinaRad
  
      this.orbit = createOrbitCircle(this.position,this.radiusOrbit, this.excentricidade)
  
      this.orbit.rotation.x = this.inclinOrbit

      this.mesh.add(this.orbit)

      scene.add(this.orbit)

      scene.add(this.mesh)
  
      
    }


    labelVisible(camera, checkedL) {

      const pos = new THREE.Vector3()
      this.mesh.getWorldPosition(pos)
      const distance =  camera.position.distanceTo(pos)
    
      if (checkedL) {
        if (!this.planet || distance < 10) {
          if(distance<10000){
          this.showLabel = true;}
          else{
           this.showLabel = false; 
          }
        } else {
    
          this.showLabel = false;
        }
      } else {
        this.showLabel = false;
      }
      
    
      this.label.visible = this.showLabel
    }


  }

function createOrbitCircle(position, radius, excentricidade) {
    var segmentCount = 512
    const pointsGeo = new THREE.BufferGeometry()
    const verts = []
    for (var i = 0; i <= segmentCount; i++) {
      var theta = (i / segmentCount) * Math.PI * 2
      var r =
        (radius * (1 - excentricidade * excentricidade)) /
        (1 - excentricidade * Math.cos(theta))
      verts.push(Math.cos(theta) * r+position.x, position.y, Math.sin(theta) * r+position.z)
    }
    const vertices = new Float32Array(verts)
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const pointsMaterial = new THREE.PointsMaterial({
      color: corAleatoria(),
      size: 1e-5,
    })
    return new THREE.Points(pointsGeo, pointsMaterial)
  } 


  export function corAleatoria() {
    const r = Math.random()
    const g = Math.random()
    const b = Math.random()
    return new THREE.Color(r, g, b)
  }