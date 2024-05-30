import {Vector3} from 'three'

import { attributs } from '../configEntities/oortAttribut.js'

import { colorSizeAleat } from '../groupsEntities/galaxy.js'
import { pushShift } from '../groupsEntities/entitiesGroups.js'

import { Object } from '../groupsEntities/entitiesGroups.js'

import { sun } from '../script.js'

export class CloudOort {
  constructor(name, qtd, meteourTexture, blending) {
    this.posInt = []
    this.posCut = []
    this.R = 23.47116 * 200000
    this.name = name
    this.distCam = this.R * 100
    this.qtd = qtd
    this.meteourTexture = meteourTexture
    this.blending = blending
    this.parameters = this.generateAttr(this.qtd)
    this.pos = new Vector3(0,0,0)
    this.maxSpeed = 1.5e-6
    this.minSpeed = 9e-7
    this.inclSpeed = 8e-11

    this.element = new Object(
      this.name,
      this.distCam,
      this.labelPosition(),
      this.parameters,
      this.blending,
      this.meteourTexture,
    )

    sun.mesh.add(this.element.objects)
  }

  generateAttr(numPoints) {
    let coord = []
    let colors = []
    let sizes = []


    let shift = [];

    this.posCut.length = 0

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1) / 1.75

      const raio = Math.cbrt(Math.random()) * this.R
      const x = raio * Math.cos(theta) * Math.sin(phi)
      const z = raio * Math.sin(phi) * Math.sin(theta)
      const y = raio * Math.cos(phi)
      const y2 = -raio * Math.cos(phi)

      
      const distance = Math.sqrt(x * x + y * y + z * z)

      let aleat = colorSizeAleat(attributs)
        colors.push(aleat.color)
        sizes.push(aleat.size)

      if (
        (!inEllipsoid(x, y, z, phi, this.R) ||
          !isInCenter(x, y, z, phi, this.R)) &&
        distance > this.R * 0.02
      ) {
        
        coord.push(new Vector3(x, y, z))
        coord.push(new Vector3(x, y2, z))
        pushShift(shift, 100000);
  
      }     
    }
    return { coord, colors, sizes,shift }
  }

  labelPosition() {
    const position = new Vector3(0, this.R, 0)

    return position
  }
}

function inEllipsoid(x, y, z, phi, radiusOort) {
  const dx = x / (2 * Math.acos(phi * 0.5) * radiusOort * 0.45)
  const dy = y / (radiusOort * 0.85)
  const dz = z / (2 * Math.acos(phi * 0.5) * radiusOort * 0.45)
  return dx * dx + dy * dy + dz * dz <= 1
}

function isInCenter(x, y, z, phi, radiusOort) {
  const dx = x / (2 * Math.acos(phi * 0.5) * radiusOort * 0.9)
  const dz = z / (2 * Math.acos(phi * 0.5) * radiusOort * 0.9)
  const isInsideSector =
    dx * dx + dz * dz <= 100 &&
    (y >= 50 ? (y * y) / (radiusOort * radiusOort) <= 100 : false)
  return isInsideSector
}
