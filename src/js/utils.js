import { Vector3 } from 'three'
import {
  ARM_X_DIST,
  GALAXY_THICKNESS,
  SPIRAL,
} from './configEntities/galaxyConfig.js'

import { Easing, Tween, update as tweenUpdate } from '@tweenjs/tween.js'

import { controls } from './script.js'

import { commands } from './gui/gui'

import { sceneManager } from './script.js'

export function gaussianRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random()
  let v = Math.random()
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

  return z * stdev + mean
}

export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

export function spiral(x, y, z, offset) {
  const distancia = (26000 * 63241.1 * 2.34117) / 5
  let r = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
  let theta = offset

  theta += Math.atan(y / x) * Math.PI
  theta += (r / ARM_X_DIST) * SPIRAL

  let exponentialFactor = 0.1
  let radiusMultiplier = Math.exp(-exponentialFactor / r)
  const x1 = r * radiusMultiplier * Math.cos(theta)
  const y1 = r * radiusMultiplier * Math.sin(theta) - distancia
  const z1 = z * Math.random()

  return new Vector3(y1, z1, x1)
}

export function curva(
  R,
  H,
  excentricidade,
  tempo,
  velTrans,
  centerX,
  centerY,
  centerZ,
) {
  const u = tempo * velTrans

  const r =
    (R * (1 - excentricidade * excentricidade)) /
    (1 - excentricidade * Math.sin(u))

  const x = r * Math.sin(u) + centerX
  const y = r * Math.cos(u) * Math.sin(-H) + centerY
  const z = r * Math.cos(u) * Math.cos(-H) + centerZ

  return { x, y, z }
}

export function anima(center, part, velocidadeTr, velmax, velmin) {
  let centerX = center.x
  let centerY = center.y
  let centerZ = center.z

  let partPos = part.element.objects.geometry.attributes.position.array

  for (let i = 0; i < partPos.length; i += 3) {
    const varVelocity = Math.random() * (velmax - velmin) + velmin
    let radius = Math.sqrt(
      (partPos[i] - centerX) ** 2 + (partPos[i + 2] - centerZ) ** 2,
    )
    const orbitalAngle = Math.atan2(
      partPos[i + 2] - centerZ,
      partPos[i] - centerX,
    )

    const speed = (velocidadeTr * varVelocity) / Math.sqrt(radius, 2)
    const theta = orbitalAngle + speed

    partPos[i] = centerX + radius * Math.cos(theta)
    partPos[i + 2] = centerZ + radius * Math.sin(theta)
  }
  part.element.objects.material.needsUpdate = true
  part.element.objects.geometry.attributes.position.needsUpdate = true
}

export function updateSize(sizeSet, part) {
  const sizes = part.element.objects.geometry.attributes.sizes.array

  for (let i = 0; i < sizes.length; i++) {
    sizes[i] = sizeSet * part.parameters.sizes[i]
  }
  part.element.objects.geometry.attributes.sizes.needsUpdate = true
}

let camLookTarget
let astroPos
let astroPosFollow

function init() {
  camLookTarget = new Vector3()
  astroPos = new Vector3()
  astroPosFollow = new Vector3()
}
init()


let prevPos = new Vector3();

export function followCamera(astro, camera) {
  const astroInfo = astro
  astroInfo.mesh.getWorldPosition(astroPosFollow)
  const currentPos = astroPosFollow;
  const movDelt = currentPos.clone().sub(prevPos);
  camera.position.add(movDelt);
  prevPos = currentPos.clone();
}

export function atualizarCameraParaAstro(astro, camera) {
  sceneManager.orbitC.enabled = false
  const astroInfo = astro
  astroInfo.mesh.getWorldPosition(astroPos)
  const { x, y, z } = astroPos
  const target = {
    x: x - astroInfo.size * 2,
    y: y + astroInfo.size * 3,
    z: z - astroInfo.size * 4,
  }

  switch (controls.mode) {
    case 'tween':
      tweenUpdate()
      new Tween(camera.position)
        .to(target)
        .duration(400)
        .easing(Easing.Cubic.Out)
        .start()

      new Tween(camLookTarget)
        .to(astroPos)
        .easing(Easing.Cubic.Out)
        .duration(100)
        .onUpdate(() => camera.lookAt(camLookTarget))
        .start()
      break

    case 'orbit':
      sceneManager.orbitC.enabled = true
      sceneManager.orbitC.target.copy(astroPos)
      sceneManager.orbitC.minDistance = astroInfo.size * 2.5
      sceneManager.orbitC.update()
      break

    case 'freeCamera':
      sceneManager.fly.movementSpeed = controls.velCam
      sceneManager.fly.rollSpeed = controls.velRotCam

      sceneManager.renderer.domElement.addEventListener('mouseenter', () => {
        sceneManager.fly.enabled = true
      })

      sceneManager.renderer.domElement.addEventListener('mouseleave', () => {
        sceneManager.fly.enabled = false
      })
      sceneManager.fly.update(0.01)
      break

    default:
      break
  }
  camLookTarget.set(x, y, z)
}



