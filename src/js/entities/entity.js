import {
  Vector3,
  SphereGeometry,
  Mesh,
  TextureLoader,
  ShaderMaterial,
  MeshPhongMaterial,
  Color,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
  Vector4,
  FrontSide,
  MathUtils,
  Group
} from 'three';

import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'

import {Loading } from '../loading/loading'

export const loading = new Loading();

import earthNightTexture from '../../../assets/textures/earth_nightmap.jpg'

import earthSpecularTexture from '../../../assets/textures/earth_specular_map.png'

import venusAtmTexture from '../../../assets/textures/venusRealAtmosphere.jpg'

import fragmentSun from '../../../shaders/noisesSun/fragment.glsl'
import vertexSun from '../../../shaders/noisesSun/vertex.glsl'

import {sceneManager } from '../script'


import { rotateAroundAxisY } from '../utils.js';

import { bodies } from '../configEntities/oscillations.js';

export class Entity {
    constructor(
      position,
      size,
      texture,
      orbitRadius,
      inclinRot,
      orbitInclin,
      speedTrans,
      speedRot,
      eccentricity,
      argPeriapsis,
      longAscNode,
      label
    ) {
      this.position = position
      this.size = size
      this.texture = texture
      this.orbitRadius = orbitRadius
      this.inclinRot = inclinRot
      this.orbitInclin = orbitInclin
      this.speedTrans = speedTrans
      this.eccentricity = eccentricity
      this.name = label
      this.posLabel = new Vector3()
      this.posRepulse = new Vector3()

      this.partPosArray = []

      this.argPeriapsis= 0
      this.longAscNode = 0


      let objOsc = bodies[this.name.toLowerCase()]
      this.ia = objOsc.ia;
      this.ifreq = objOsc.ifreq;
      this.ra = objOsc.ra;
      this.rfreq = objOsc.rfreq;
      this.precession = objOsc.precession;


      this.scene = sceneManager.scene
  
      this.textureLoader = new TextureLoader(loading.loadingManager)
      this.geo = new SphereGeometry(this.size, 64, 64)

      this.speedRot = speedRot
      if (this.name.toLowerCase() === 'sun') {
        this.mat = new ShaderMaterial({
          uniforms: {
              time: {value: 0},
              uPerlin: { value: null },
              resolution: { value: new Vector4() }
          },
          vertexShader: vertexSun,
          fragmentShader: fragmentSun,
          transparent:true     
          
      });
      } else {


        if (this.name.toLowerCase() === 'earth') {
         
        this.mat = new MeshPhongMaterial({
          map: this.textureLoader.load(this.texture),
          alphaTest: 0.5,
          emissiveMap: this.textureLoader.load(earthNightTexture),
          emissive: new Color(0xaaaaaaaa),
          emissiveIntensity: 0.5,
          specularMap: this.textureLoader.load(earthSpecularTexture),
          specular: 1,
          shininess: 50,
          alphaTest: 0.5,
          transparent:true
          
    
        })
      } else if(this.name.toLowerCase() === 'venus'){
        this.mat = new MeshPhongMaterial({
          side: FrontSide,
          map: this.textureLoader.load(this.texture),
          bumpScale: 0.5,
          shininess: 0.5,
          alphaTest: 0.5,
          transparent: true
      });
      this.geoAtm = new SphereGeometry(this.size * 1.005, 64, 64);
      this.matAtm = new MeshPhongMaterial({
          side: FrontSide,
          map: this.textureLoader.load(venusAtmTexture),
          transparent: true,
          opacity: 0.7,
           
      });
      this.meshAtm = new Mesh(this.geoAtm, this.matAtm);  
      this.meshAtm.renderOrder = 2; 
      
      }
      else{
        this.mat = new MeshPhongMaterial({
          side: FrontSide,
          map: this.textureLoader.load(this.texture),
          bumpScale: 0.5,
          shininess: 0.5, 
          alphaTest: 0.5,
          transparent:true,
          depthTest:true
        })
        
      }
      }
      this.mesh = new Mesh(this.geo, this.mat) 



   

    
      this.mesh.position.x = this.orbitRadius
  
      this.inclinaRad = (this.inclinRot * Math.PI) / 180.0
  
      

      this.orbit = this.createOrbitCircle(this.position,this.orbitRadius, this.eccentricity,this.ia,this.ifreq,this.ra,this.rfreq)


      this.initialPositions()

      
      
      this.scene.add(this.orbit)
  
      this.div = document.createElement('div')
      this.div.className = 'label'
      this.div.textContent = this.name
      this.div.style.backgroundColor = 'transparent'
  
      this.label = new CSS2DObject(this.div)
      this.scene.add(this.mesh)   
      this.scene.add(this.label)

   
    }
  
    setLabelVisible(camera, checkedL) {
      this.mesh.getWorldPosition(this.posLabel)
      this.posLabel.y += this.size * 1.1;
      this.label.position.copy(this.posLabel);
      const distance = camera.position.distanceTo(this.posLabel)
      this.show =
        checkedL &&
        (distance < Math.abs(this.orbitRadius*50))
  
      this.label.visible = this.show
    }
    detectCollision(camera) {

      this.mesh.getWorldPosition(this.posRepulse)

      let den = Math.min(0.7, MathUtils.mapLinear(this.size, 8e-5, 1e-2, 0.5, 0.7))

      this.distance = camera.position.distanceTo(this.posRepulse)*den
  
      if (this.distance < this.size) {
        const repulsionForce = (this.size*1e-2)/ this.distance;
  
        const repulsionDirection = new Vector3()
          .copy(camera.position)
          .sub(this.posRepulse)
          .normalize()
  
        camera.position.add(repulsionDirection.multiplyScalar(repulsionForce*sceneManager.fly.movementSpeed))
      }
    }


    createOrbitCircle(position, R, e, ia, ifreq, ra, rfreq) {
      const segmentCount = 1024;
      const pointsGeo = new BufferGeometry();
      const verts = [];
    
      for (let i = 0; i <= segmentCount; i++) {
        const M = (i / segmentCount) * Math.PI * 2;

        const tol = 1e-6;
        let E = M

        let delta = 1;
        while (Math.abs(delta) > tol) {
          delta = E - e * Math.sin(E) - M;
          E -= delta / (1 - e * Math.cos(E));
        }
        const theta = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));



        const H_osc = this.orbitInclin + ia * Math.sin(ifreq * (theta));
        const r_base = (R * (1 - e * e)) / (1 + e * Math.cos(theta));
        const r_osc = r_base + ra * Math.sin(rfreq * (theta));
        

        const x = r_osc * Math.sin(theta) + position.x;
        const y = r_osc * Math.cos(theta) * Math.sin(-H_osc) + position.y;
        const z = r_osc * Math.cos(theta) * Math.cos(-H_osc) + position.z;
    
        verts.push(x, y, z);
      }
    
      const vertices = new Float32Array(verts);
      pointsGeo.setAttribute('position', new BufferAttribute(vertices, 3));
    
      const pointsMaterial = new PointsMaterial({
        color: corAleatoria(), 
        size: this.size * 0.25,
        depthTest: true,
        depthWrite: false
      });
    
      return new Points(pointsGeo, pointsMaterial);
    }
    initialPositions() {
      let partPos = this.orbit.geometry.attributes.position.array;
      for (let i = 0; i < partPos.length; i += 3) {
        let vector = new Vector3(partPos[i], partPos[i + 1], partPos[i + 2]);
        this.partPosArray.push(vector);
      }
    }
    animate(M) {
      let partPos = this.orbit.geometry.attributes.position.array;
      let precessionAngle = M*this.precession;

      for (let i = 0; i < this.partPosArray.length; i ++) {
        let rotated = rotateAroundAxisY(this.partPosArray[i].x, this.partPosArray[i].y, this.partPosArray[i].z, precessionAngle);
        partPos[i*3] = rotated.newX
        partPos[i*3 + 1] = rotated.newY
        partPos[i*3 + 2] = rotated.newZ
      }
    
      this.orbit.geometry.attributes.position.needsUpdate = true;
    
  }

}
  export function corAleatoria() {
    const min = 0.5;
    const r = Math.random() * (1 - min) + min;
    const g = Math.random() * (1 - min) + min;
    const b = Math.random() * (1 - min) + min;
    return new Color(r, g, b);
  }