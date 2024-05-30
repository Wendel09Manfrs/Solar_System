import { Vector3, MathUtils } from 'three'
import {
  ARM_X_DIST,
  SPIRAL,
} from './configEntities/galaxyConfig.js'

import { Easing, Tween, update as tweenUpdate } from '@tweenjs/tween.js'

import { controls } from './script.js'

import { sceneManager } from './script.js'

export function gaussianRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random()
  let v = Math.random()
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

  return z * stdev + mean
}

export function spiral(x, y, z, offset) {
  let r = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
  let theta = offset

  theta += Math.atan(y / x) * Math.PI
  theta += (r / ARM_X_DIST) * SPIRAL

  let exponentialFactor = 0.1
  let radiusMultiplier = Math.exp(-exponentialFactor / r)
  const x1 = r * radiusMultiplier * Math.cos(theta)
  const y1 = r * radiusMultiplier * Math.sin(theta) 
  const z1 = z * Math.random()

  return new Vector3(y1, z1, x1)
}


export function orbit(
  R, H, e, u, cx, cy, cz,
  ia = 0.01, // Amplitude of the oscillation in the slope
  ifreq = 0.1, // Frequency of oscillation in slope
  ra = 0.01, // Radial oscillation amplitude
  rfreq = 0.1// Radial oscillation frequency
) {
  const H_osc = H + ia * Math.sin(ifreq * u);
  const r_base = (R * (1 - e * e)) / (1 - e * Math.sin(u));
  const r_osc = r_base + ra * Math.sin(rfreq * u);

  const x = r_osc * Math.sin(u) + cx;
  const y = r_osc * Math.cos(u) * Math.sin(-H_osc) + cy;
  const z = r_osc * Math.cos(u) * Math.cos(-H_osc) + cz;

  return { x, y, z };
}

export function animateParts(center, part, time, velmax, velmin) {
  let centerX = center.x
  let centerZ = center.z

  let partPos = part.element.objects.geometry.attributes.position.array

  for (let i = 0; i < partPos.length; i += 3) {
    const varSpeed = Math.random() * (velmax - velmin) + velmin
    let radius = Math.sqrt(
      (partPos[i] - centerX) ** 2 + (partPos[i + 2] - centerZ) ** 2,
    )
    const orbitalAngle = Math.atan2(
      partPos[i + 2] - centerZ,
      partPos[i] - centerX,
    )

    const speed = (-time * varSpeed) / Math.sqrt(radius, 2)
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

let objectPos

function init() {
  camLookTarget = new Vector3()
  objectPos = new Vector3()
  posCloser = new Vector3()
}
init()




export function updateCamFor(object, camera, distCloser) {
  sceneManager.orbitC.enabled = false;
  object.mesh.getWorldPosition(objectPos);

  const { x, y, z } = objectPos;
  const target = {
    x: x - object.size * 3,
    y: y + object.size * 3,
    z: z - object.size * 3,
  };

  const modeActions = {
    tween: () => {
      tweenUpdate();
      new Tween(camera.position)
        .to(target)
        .duration(1000)
        .easing(Easing.Cubic.Out)
        .start();

      new Tween(camLookTarget)
        .to(objectPos)
        .easing(Easing.Cubic.Out)
        .duration(500)
        .onUpdate(() => camera.lookAt(camLookTarget))
        .start();
    },
    orbit: () => {
      tweenUpdate();
      sceneManager.orbitC.enabled = true;
      sceneManager.orbitC.target.copy(objectPos);
      sceneManager.orbitC.minDistance = object.size * 2.5;
      sceneManager.orbitC.update();
    },
    freeCamera: () => {
      tweenUpdate();
      sceneManager.fly.movementSpeed = controls.speedCam * distCloser;
      sceneManager.fly.rollSpeed = controls.speedRotCam;

      sceneManager.renderer.domElement.addEventListener('mouseenter', () => {
        sceneManager.fly.enabled = true;
      });

      sceneManager.renderer.domElement.addEventListener('mouseleave', () => {
        sceneManager.fly.enabled = false;
      });

      sceneManager.fly.update(0.01);
    }
  };

  if (modeActions[controls.mode]) {
    modeActions[controls.mode]();
  }

  camLookTarget.set(x, y, z);
}




export function mapValue(x) {
  const inputMin = 8e-5;
  const inputMax = 1e-2;
  const outputMin = 0.5;
  const outputMax = 0.7;
  const y = MathUtils.mapLinear(x, inputMin, inputMax, outputMin, outputMax);
  return Math.round(y * 100) / 100;
}

export function findClosestBody(camera, objects) {
  let minDist = Infinity;

  for (let key in objects) {
    if (objects.hasOwnProperty(key)) {
      let object = objects[key];
      if (object.mesh) {
        object.mesh.getWorldPosition(posCloser)
        let distance = camera.position.distanceTo(posCloser);
        if (distance < minDist) {
          minDist = distance;
          labelCloser = key;
        }
      }
    }
  }
  return {minDist:minDist, labCloser:labelCloser };
}

export function calculateOpacity(camera, galaxyCenter, galaxyNormal) {
  let cameraDirection = new Vector3();
  cameraDirection.subVectors(camera.position, galaxyCenter).normalize();
  let dotProduct = Math.abs(cameraDirection.dot(galaxyNormal));
  let opacity = ((0.08 - 0.01) * dotProduct + 0.01);
  return opacity;
}





