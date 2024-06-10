import {Vector3, BufferGeometry, Float32BufferAttribute, ShaderMaterial,Points, AdditiveBlending, MathUtils} from 'three'

import { attributsDust } from '../configEntities/tailAttribut.js'

import { attributsGas } from '../configEntities/tailAttribut.js'


import vertexComet from '../../../shaders/tailComet/vertex.glsl'
import fragmentComet from '../../../shaders/tailComet/fragment.glsl'

import { colorSizeAleat } from './galaxy.js'

export class Tail {
  constructor(mesh, qtd, scene) {
    this.mesh = mesh
    this.qtd = qtd
    this.parametersDust = this.generateAttr(this.qtd, attributsDust)

    this.parametersGas = this.generateAttr(this.qtd*0.7, attributsGas)
    this.pos = new Vector3(0,0,0)
    this.scene = scene
    this.dust = this.createPoints(this.parametersDust)

    this.gas = this.createPoints(this.parametersGas)

    this.conditionMet = false;
    
  }

  generateAttr(numPoints, attributsDust) {
    let coord = []
    let colors = []
    let sizes = []
    let opacity = []


    for (let i = 0; i < numPoints; i++) {

      const r = 1.57e-2 * Math.sqrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      let aleat = colorSizeAleat(attributsDust)
      colors.push(aleat.color)
      sizes.push(aleat.size)
      opacity.push(1.0)

      coord.push(new Vector3(x, y, z))
    }

    return { coord, colors, sizes, opacity}
  }

  createPoints(parameters){
    this.objectGeometry = new BufferGeometry()

    this.objectGeometry.setAttribute(
      'color',
      new Float32BufferAttribute(
        parameters.colors.flatMap((c) => [c.r, c.g, c.b]),
        3,
      ),
    )

    this.objectGeometry.setAttribute(
      'sizes',
      new Float32BufferAttribute(parameters.sizes, 1),
    )

    this.objectGeometry.setAttribute(
      'opacity',
      new Float32BufferAttribute(parameters.opacity, 1),
    )

    this.objectGeometry.setAttribute(
      'position',
      new Float32BufferAttribute(
        parameters.coord.flatMap((v) => [v.x, v.y, v.z]),
        3,
      ),
    )

    this.pointMaterial = new ShaderMaterial({
      uniforms: {
        globalOpacity: { value: 1.2e-2 },
      },
      vertexShader: vertexComet,
      fragmentShader: fragmentComet,

      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    })
   
    let objects = new Points(this.objectGeometry, this.pointMaterial)

    this.scene.add(objects)

    return objects
  }

  posTailsGas(tail, opacity){

    tail.position.copy(this.mesh.position)
    const sphereRadius =1.2e-2
    let partPos = tail.geometry.attributes.position.array
    let sizes = tail.geometry.attributes.sizes.array;
    let opacityArray = tail.geometry.attributes.opacity.array;
    const speedFactor = 2; 

    for (let i = 0; i <  this.qtd; i++) {
      partPos[i * 3 + 2] -= 0.6e-2*speedFactor;
      if (Math.random() < 0.009) {
          partPos[i * 3] += (Math.random() * 2 - 1) * sphereRadius * 4;
          partPos[i * 3 + 1] += (Math.random() * 2 - 1) * sphereRadius * 4;
      }
  
      if (partPos[i * 3 + 2] < -3e-1) {
          if (Math.random() < 0.01) {
              partPos[i * 3] = (Math.random() * 1.5 - .75) * sphereRadius * 1.5;
              partPos[i * 3 + 1] = (Math.random() * 1.5 - .75) * sphereRadius * 1.5;
              partPos[i * 3 + 2] = (Math.random() * 1.5 - .75) * sphereRadius * 1.5;
          }
      }

      if (Math.random() < 0.05) {
          partPos[i * 3] += (Math.random() * 2 - 1) * sphereRadius * 2;
          partPos[i * 3 + 1] += (Math.random() * 2 - 1) * sphereRadius * 2;
          partPos[i * 3 + 2] += (Math.random() * 2 - 1) * sphereRadius * 2;
      }

      let distance = Math.sqrt(
        Math.pow(partPos[i * 3] - 0, 2) +
        Math.pow(partPos[i * 3+1] - 0, 2) +
        Math.pow(partPos[i * 3+2] - 0, 2)
    );

    let dist = Math.max(1,Math.min(6, distance))

    sizes[i] = this.parametersGas.sizes[i]*dist

    let distOp = MathUtils.mapLinear(dist, 0, 6, 1, 0) 
    opacityArray[i] = Math.max(0,Math.min(1, distOp));

  }
  tail.geometry.attributes.position.needsUpdate = true
  tail.geometry.attributes.sizes.needsUpdate = true;
  tail.geometry.attributes.opacity.needsUpdate = true;

  tail.material.uniforms.globalOpacity.value = 
    Math.max(0,Math.min(1.2e-2, opacity))


  }


  posTailsDust(tail, posSun, opacity) {
    tail.position.copy(this.mesh.position);
    const sphereRadius = 1.57e-2;
    let partPos = tail.geometry.attributes.position.array;
    let sizes = tail.geometry.attributes.sizes.array;
    let opacityArray = tail.geometry.attributes.opacity.array;

    let cometToSun = new Vector3();
    cometToSun.subVectors(this.mesh.position, posSun).normalize();

    for (let i = 0; i < this.qtd; i++) {

        let particlePosition = new Vector3(
            partPos[i * 3],
            partPos[i * 3 + 1],
            partPos[i * 3 + 2]
        );

        const speedFactor = 2; 
       particlePosition.z -= 0.628e-2 * speedFactor;
        if (Math.random() < 0.009) {
            particlePosition.x += (Math.random() * 2 - 1) * sphereRadius * 3;
            particlePosition.y += (Math.random() * 2 - 1) * sphereRadius * 3;
        }

        if (particlePosition.z < -0.1e-1) {
            if (Math.random() < 0.01) {
                particlePosition.x = (Math.random() * 1.5 - 0.75) * sphereRadius * 1.5;
                particlePosition.y = (Math.random() * 1.5 - 0.75) * sphereRadius * 1.5;
                particlePosition.z = (Math.random() * 0.75 - 0.375) * sphereRadius * 0.75;
            }
        }

        if (Math.random() < 0.02) {
            particlePosition.x += (Math.random() * 2 - 1) * sphereRadius * 2;
            particlePosition.y += (Math.random() * 2 - 1) * sphereRadius * 2;
            particlePosition.z += (Math.random() * 2 - 1) * sphereRadius * 2;
        }
        let inclination = cometToSun.clone().multiplyScalar(0.002 * particlePosition.z);
        particlePosition.add(inclination);

        partPos[i * 3] = particlePosition.x;
        partPos[i * 3 + 1] = particlePosition.y;
        partPos[i * 3 + 2] = particlePosition.z;

        let distance = Math.sqrt(
          Math.pow(partPos[i * 3] - 0, 2) +
          Math.pow(partPos[i * 3+1] - 0, 2) +
          Math.pow(partPos[i * 3+2] - 0, 2)
      );
  
       let dist = Math.max(1,Math.min(7, distance))
    
      sizes[i] = this.parametersGas.sizes[i]*dist

      let distOp = MathUtils.mapLinear(dist, 0, 6, 1, 0) 
      opacityArray[i] = Math.max(0,Math.min(1, distOp));
    }

    tail.geometry.attributes.position.needsUpdate = true;
    tail.geometry.attributes.sizes.needsUpdate = true;
    tail.geometry.attributes.opacity.needsUpdate = true;

    tail.material.uniforms.globalOpacity.value = 
    Math.max(0,Math.min(1.2e-2, opacity))

}


  animate(posSun){
    let distSun = this.mesh.position.distanceTo(posSun)

    const opacity = MathUtils.mapLinear(distSun, 0, 176, 1.2e-2, 0);
  
    this.posTailsGas(this.gas, opacity*0.9)
    this.posTailsDust(this.dust, posSun, opacity)

    this.gas.lookAt(posSun)
    this.dust.lookAt(posSun)


    this.checkDistanceAndUpdate(distSun)
  }

  checkDistanceAndUpdate(distSun) {
    if (distSun >= 176) {
        if (!this.conditionMet) {
            remove(this.gas, this.scene);
            remove(this.dust, this.scene);
            this.conditionMet = true; 
        }
    } else {
        if (this.conditionMet) {
            this.dust = this.createPoints(this.parametersDust);
            this.gas = this.createPoints(this.parametersGas);
            this.conditionMet = false; 
        }
    }
}
}

function remove (points, scene){
  scene.remove(points)
  points.geometry.dispose();
  points.material.dispose();
}