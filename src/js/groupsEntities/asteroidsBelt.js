import {Vector3} from 'three'

import { r, R, thetaSet, phiSet, circle } from '../configEntities/beltFormat.js'

import { attributs } from '../configEntities/beltAttribut.js'

import { colorSizeAleat } from '../groupsEntities/galaxy.js'
import { Object } from '../groupsEntities/entitiesGroups.js'

import { sun } from '../script.js'

import { pushShift } from '../groupsEntities/entitiesGroups.js'

export class Belt {
  constructor(name, qtd, meteourTexture, blending) {
    this.name = name
    this.distCam = 8000
    this.qtd = qtd
    this.meteourTexture = meteourTexture
    this.blending = blending

    this.maxSpeed = 5e-3
    this.minSpeed = 1e-3
    this.inclSpeed = 2e-7
    this.speeds = []
    this.parameters = this.generateAttr(this.qtd)
    this.pos = new Vector3(0,0,0)


    
    this.R = R

    this.element = new Object(
      this.name,
      this.distCam,
      this.labelPosition(),
      this.parameters,
      this.blending,
      this.meteourTexture,
    )
    
  }

  generateAttr(numPoints) {
    let coord = [];
    let colors = [];
    let sizes = [];
    let shift = [];
    let randValue = []
    

    for (let i = 0; i < numPoints; i++) {
        const targetRMean = 0.5;
        const targetRStdDev = r /1.25;  
        const targetR = Math.abs(randomNormal(targetRMean, targetRStdDev));

        const targetC = Math.random() * r + R;

        const thetaMean = 0;
        const thetaStdDev = Math.PI * thetaSet;
        const theta = randomNormal(thetaMean, thetaStdDev) * circle;

        const phiMean = Math.PI;
        const phiStdDev = Math.PI * phiSet;
        const phi = randomNormal(phiMean, phiStdDev) * circle;

        const x = (targetC + targetR * Math.cos(theta)) * Math.cos(phi);
        const z = (targetC + targetR * Math.cos(theta)) * Math.sin(phi);
        const y = targetR * Math.sin(theta);

        let aleat = colorSizeAleat(attributs);
        colors.push(aleat.color);
        sizes.push(aleat.size);
        randValue.push(Math.random() * 10.0*i)

        const randomSpeed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
        this.speeds.push(randomSpeed)

        pushShift(shift, 2.5);

        coord.push(new Vector3(x, y, z));
    }

    return { coord, colors, sizes,shift, randValue}
  }
  labelPosition() {
    const position = new Vector3(R, r, 0)

    return position
  }

  centerOrbit() {
    this.element.objects.position.copy(sun.mesh.position)
  }
}

export function randomNormal(mean, stddev) {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return num * stddev + mean
}


