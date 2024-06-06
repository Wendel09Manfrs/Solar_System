import { Vector3, Color } from 'three'

import {
  ARMS,
  ARM_X_DIST,
  ARM_X_MEAN,
  ARM_Y_DIST,
  ARM_Y_MEAN,
  CORE_X_DIST,
  CORE_Y_DIST,
  GALAXY_THICKNESS,
  OUTER_CORE_X_DIST,
  OUTER_CORE_Y_DIST,
} from '../configEntities/galaxyConfig.js'
import { gaussianRandom, spiral } from '../utils.js'

import { Object } from '../groupsEntities/entitiesGroups.js'

import { attributs } from '../configEntities/starAttribut.js'
import { pushShift } from '../groupsEntities/entitiesGroups.js'

export class Galaxy {
  constructor(name, qtd, starTexture, blending) {
    this.distancia = (26000 * 63241.1 * 2.34117) / 5
    this.name = name
    this.qtd = qtd
    this.starTexture = starTexture
    this.blending = blending
    this.pos = new Vector3(0,0,0)
    this.maxSpeed = -4e-8
    this.minSpeed = -1e-8
    this.inclSpeed = 1e-13

    this.parameters = this.generateAttr(this.qtd)

    this.element = new Object(
      this.name,
      this.distancia,
      this.labelPosition(),
      this.parameters,
      this.blending,
      this.starTexture,
    )

    this.element.objects.rotation.x = -1.05068821;
    this.element.objects.rotation.order = "ZYX";
  }
  generateAttr(numStars) {
    let coord = []
    let colors = []
    let sizes = []

    let shift = []
 

    for (let i = 0; i < numStars / 6; i++) {
      const x = gaussianRandom(0, CORE_X_DIST)
      const y = gaussianRandom(0, CORE_Y_DIST)
      const z = gaussianRandom(0, GALAXY_THICKNESS)

      let xyz = new Vector3(y, z, x)

      let aleat = colorSizeAleat(attributs)
      colors.push(aleat.color)
      sizes.push(aleat.size)
      coord.push(xyz)
      pushShift(shift, 160000000)
    }

    for (let i = 0; i < numStars / 6; i++) {
      const x1 = gaussianRandom(0, OUTER_CORE_X_DIST)
      const y1 = gaussianRandom(0, OUTER_CORE_Y_DIST)
      const z1 = gaussianRandom(0, GALAXY_THICKNESS)

      let xyz = new Vector3(x1, z1, y1)

      let aleat = colorSizeAleat(attributs)
      colors.push(aleat.color)
      sizes.push(aleat.size * 1.3)
      coord.push(xyz)
      pushShift(shift, 100000000)
    }

    for (let j = 0; j < ARMS; j++) {
      for (let i = 0; i < numStars / 3; i++) {
        const x2 = gaussianRandom(ARM_X_MEAN, ARM_X_DIST)
        const y2 = gaussianRandom(ARM_Y_MEAN, ARM_Y_DIST)
        const z2 = gaussianRandom(0, GALAXY_THICKNESS)

        let xyz = spiral(x2, y2, z2, (j * 2 * Math.PI) / ARMS)

        let aleat = colorSizeAleat(attributs)
        colors.push(aleat.color)
        sizes.push(aleat.size)
        coord.push(xyz)
        pushShift(shift, 100000000)

      }
    }
    return {
      coord,
      colors,
      sizes,
      shift,
    }
  }
  labelPosition() {
    const position = new Vector3(
      0,
      GALAXY_THICKNESS,
      this.distancia,
    )

    return position
  }
  centerOrbit() {
    this.element.objects.position.copy(this.pos)
  }
}

export function colorSizeAleat(attributs) {
  const totalPorcentagem = attributs.percentage.reduce(
    (acc, curr) => acc + curr,
    0,
  )
  const randomPercentage = Math.random() * totalPorcentagem

  let sum = 0
  let index = 0

  for (let i = 0; i < attributs.percentage.length; i++) {
    sum += attributs.percentage[i]
    if (randomPercentage <= sum) {
      index = i
      break
    }
  }

  const chosenColor = attributs.color[index]
  const r = (chosenColor >> 16) & 255
  const g = (chosenColor >> 8) & 255
  const b = chosenColor & 255

  const chosenSize = attributs.size[index]

  return {
    color: new Color(r / 255, g / 255, b / 255),
    size: chosenSize,
  }
}


