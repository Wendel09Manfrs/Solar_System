import {Vector3} from 'three'

import { r, R, thetaSet, phiSet } from '../configEntities/kuiperFormat.js'

import { attributs } from '../configEntities/kuiperAttribut.js'

import { colorSizeAleat } from './galaxy.js'


import { pushShift } from '../groupsEntities/entitiesGroups.js'

import { Object } from './entitiesGroups.js'
import { randomNormal } from './asteroidsBelt.js'

import { sun } from '../script.js'


export class Kuiper {
  constructor(circle, name, qtd, meteourTexture, blending) {
    this.circle = circle
    this.name = name
    this.distCam = 12000
    this.qtd = qtd
    this.meteourTexture = meteourTexture
    this.blending = blending
    this.maxSpeed = 3e-4
    this.minSpeed = 9.6e-5
    this.inclSpeed = 1e-7
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
    let coord = []
    let colors = []
    let sizes = []
    
    let randValue = []
    let shift = [];


    for (let i = 0; i < numPoints; i++) {
      const targetRMean = 0.5;
      const targetRStdDev = r /2;  
      const targetR = Math.abs(randomNormal(targetRMean, targetRStdDev));
      const targetC = Math.random() * r + R

      const thetaMean = 0
      const thetaStdDev = Math.PI * thetaSet
      const theta = randomNormal(thetaMean, thetaStdDev) * this.circle

      const phiMean = Math.PI
      const phiStdDev = Math.PI * phiSet
      const phi = randomNormal(phiMean, phiStdDev) * this.circle

      const x = (targetC + 2*targetR * Math.cos(theta)) * Math.cos(phi)
      const z = (targetC + 2*targetR * Math.cos(theta)) * Math.sin(phi)
      const y = targetR * Math.sin(theta)

      let aleat = colorSizeAleat(attributs)
      colors.push(aleat.color)
      sizes.push(aleat.size)
      randValue.push(Math.random() * 10.0*i)
      
      const randomSpeed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
      this.speeds.push(randomSpeed)

      pushShift(shift, 100);
      coord.push(new Vector3(x, y, z))
    }

    return { coord, colors, sizes, shift,randValue}
  }
  labelPosition() {
    const position = new Vector3(R, r, 0)

    return position
  }
  centerOrbit() {
    this.element.objects.position.copy(sun.mesh.position)
  }
}
