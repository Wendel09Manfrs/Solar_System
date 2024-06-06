import {
  MathUtils,
  Vector3,
  AdditiveBlending,
  Clock,
  AlwaysDepth,
  Color,
  NoBlending
} from 'three'

import { Planet } from './entities/planet'
import { Satellite } from './entities/satellite'
import { Star } from './entities/star'

import {Comet} from './entities/comet.js'

import { BlackHole } from './entities/blackHole.js'
import { WhiteHole } from './entities/whiteHole.js'

import { GuiInterface } from './gui/gui'

import { Nebula } from './groupsEntities/nebula.js'
import { Galaxy } from './groupsEntities/galaxy.js'
import { Belt } from './groupsEntities/asteroidsBelt.js'
import { Kuiper } from './groupsEntities/asteroidsKuiper.js'
import { CloudOort } from './groupsEntities/cloudOort.js'


import { updateCamFor } from './utils.js'

import mercuryTexture from '../../assets/textures/mercuryReal.jpg'
import venusTexture from '../../assets/textures/venusReal.jpg'
import earthTexture from '../../assets/textures/earthReal.jpg'

import marsTexture from '../../assets/textures/marsReal.jpg'
import saturnTexture from '../../assets/textures/saturnReal.jpg'
import jupiterTexture from '../../assets/textures/jupiterReal.jpg'
import uranusTexture from '../../assets/textures/uranusReal.jpg'
import ringSaturnTexture from '../../assets/textures/saturn-rings.png'
import ringUranusTexture from '../../assets/textures/uranus-ring.png'
import neptuneTexture from '../../assets/textures/neptuneReal.jpg'
import plutoTexture from '../../assets/textures/pluto.jpg'

import meteourTexture from '../../assets/textures/meteour.png'

import moonTexture from '../../assets/textures/moon.jpg'

import europaTexture from '../../assets/textures/europaJupiter.png'
import callistoTexture from '../../assets/textures/callistoJupiter.jpg'
import ganymedeTexture from '../../assets/textures/ganymedeJupiter.jpg'
import iOTexture from '../../assets/textures/iOJupiter.jpeg'

import dioneTexture from '../../assets/textures/dioneSaturn.jpg'
import iapetusTexture from '../../assets/textures/iapetusSaturn.jpg'
import rheaTexture from '../../assets/textures/rheaSaturn.jpg'
import titanTexture from '../../assets/textures/titanSaturn.jpg'
import starsTexture from '../../assets/textures/star.png'

import { SceneManager } from './configScene/scene.js'
import {animateParts, findClosestBody, orbit, calculateOpacity} from './utils.js'


import * as THREE from 'three';






export const sceneManager = new SceneManager()
sceneManager.init()

var renderer = sceneManager.renderer
export let scene = sceneManager.scene
var camera = sceneManager.camera

camera.add(sceneManager.noises.plane.mesh)

const distSargitarius = (-26000 * 63241.1 * 2.34117) / 5

const posHoleBlack = new Vector3(0, 0, 0)
const posHoleWhite = new Vector3(1.2 * distSargitarius, 1e5, distSargitarius)

const sargitariusA = new BlackHole(3.7654, 'Sargitarius A*', posHoleBlack, posHoleWhite)
const whiteHole = new WhiteHole(3.7654, 'White Hole', posHoleWhite)

const posSun = new Vector3()
const velSun = -9.016846e-11


export const sun = new Star(
  new Vector3(0, 0, 0),
  1.0929e-1,
  distSargitarius,
  0,
  -1.05068821,
  velSun,
  2.916846e-1,
    0,
  'Sun'
)
const mercury = new Planet(
  3.83e-4,
  mercuryTexture,
  9.09058,
  0.034,
  0.05899,
  8.264e-2,
  1.24e-1,
  0.2056,
  1.35186223,
  0.84351763,
  'Mercury',
  new Color(0xddadad),
  new Color(0x808080),
)




const venus = new Planet(
  9.5e-4,
  venusTexture,
  16.986,
  177.4,
  0.067369,
  3.232e-2,
  2.99259e-2,
  0.0068,
  2.2956,
  1.338,
  'Venus',
  new Color(0xe6e4a8),
  new Color(0xf5deb3),
)

venus.mesh.add(venus.meshAtm)



const earth = new Planet(
  1e-3,
  earthTexture,
  23.47, 
  23.44,
  0.12487,
  1.992e-2,
  7.2921,
  0.0167,
  1.796,
  3.05,
  'Earth',
  new Color(0x67ceeb),
  new Color(0x2faefb),
)
const moon = new Satellite(
  2.73e-4,
  moonTexture,
  6.0335e-2,
  6.687,
  0.0898,
  2.6617e-1,
  2.6617e-1,
  0.0549,
  0,
  0,
  'moon',
  earth
)

const mars = new Planet(
  5.32e-4,
  marsTexture,
  35.743,
  25.19,
  0.0986111,
  1.059e-2,
  7.0882,
  0.0934,
  5.865,
  0.864,
  'Mars',
  new Color(0xffa07a),
  new Color(0xe9967a),
)
const jupiter = new Planet(
  1.12e-2,
  jupiterTexture,
  122.153,
  3.12,
  0.1062906,
  1.673e-3,
  1.7734e1,
  0.0484,
  0.2574,
  1.753,
  'Jupiter',
  new Color(0x00b68c),
  new Color(0xd2b48c),
)

const saturn = new Planet(
  9.45e-3,
  saturnTexture,
  224.107,
  26.73,
  0.09616764,
  9.294e-4,
  1.63624e1,
  0.0541,
  1.613,
  1.983,
  'Saturn',
  new Color(0xf5deb3),
  new Color(0xd2b48c),
  
  {
    innerRadius: 1.17e-2,
    outerRadius: 2.15e-2,
    texture: ringSaturnTexture,
  },
)
const uranus = new Planet(
  3.98e-3,
  uranusTexture,
  450.523,
  97.77,
  0.1130973,
  2.37e-4,
  1.041e1,
  0.0472,
  2.983,
  1.29,
  'Uranus',
  new Color(0xafeeee),
  new Color(0x40e0d0),

  {
    innerRadius: 5.96e-3,
    outerRadius: 7.29e-3,
    texture: ringUranusTexture,
  },
)

const neptune = new Planet(
  3.85e-3,
  neptuneTexture,
  706.657,
  28.32,
  0.1122247,
  1.208e-4,
  1.08e1,
  0.0086,
  0.784,
  2.3,
  'Neptune',
  new Color(0x4169e1),
  new Color(0x005fff),
)
const pluto = new Planet(
  1.9e-4,
  plutoTexture,
  927.7436,
  119.61,
  0.29917997705,
  8.01e-5,
  1.2956,
  0.2488,
  1.985,
  1.925,
  'Pluto',
  new Color(0x00eeff),
  new Color(0xfae2ff),
)

const europa = new Satellite(
  2.45e-4,
  europaTexture,
  1.0538e-1,
  0.0174533,
  0.00820304748,
  2.053433773,
  2.053715175,
  0.0094,
  0,
  0,
  'Europa',
  jupiter,
)

const callisto = new Satellite(
  3.78e-4,
  callistoTexture,
  2.9595e-1,
  0,
  0.0033510322,
  4.369409e-1,
  4.369445e-1,
  0.0074,
  0,
  0,
  'Callisto',
  jupiter,
)
const ganymede = new Satellite(
  4.13e-4,
  ganymedeTexture,
  1.6848e-1,
  0.005759587,
  0.00349066,
  1.019227339,
  1.019227339,
  0.0013,
  0,
  0,
  'Ganymede',
  jupiter,
)
const iO = new Satellite(
  2.86e-4,
  iOTexture,
  6.623e-2,
  0,
  0.0008726646,
  4.12,
  4.129,
  0.004,
  0,
  0,
  'iO',
  jupiter,
)

const dione = new Satellite(
  8.821e-5,
  dioneTexture,
  5.931e-2,
  0,
  0.00033161256,
  2.664,
  2.664,
  0.022,
  0,
  0,
  'Dione',
  saturn,
)
const iapetus = new Satellite(
  1.15e-4,
  iapetusTexture,
  5.5943e-1,
  0,
  0.27000244,
  9.193e-2,
  9.1956e-2,
  0.0281,
  0,
  0,
  'Iapetus',
  saturn,
)
const rhea = new Satellite(
  1.2e-4,
  rheaTexture,
  8.286e-2,
  0,
  0.0060213859,
  1.6139,
  1.614,
  0.002583,
  0,
  0,
  'Rhea',
  saturn,
)
const titan = new Satellite(
  4.06e-4,
  titanTexture,
  1.9205e-1,
  0,
  0.0060737,
  4.9678e-1,
  4.9678e-1,
  0.0288,
  0,
  0,
  'Titan',
  saturn,
)







let galaxy = new Galaxy(
  'Milk Way Galaxy',
  15000,
  starsTexture,
  AdditiveBlending,
)
let galaxyCenter = new Vector3(0, 0, 0);
let galaxyNormal = new Vector3(0, Math.cos(-1.05068821), Math.sin(-1.05068821)).normalize();

let nebula = new Nebula(null, 2000, AdditiveBlending)

let belt = new Belt('Asteroid Belt', 2000, meteourTexture, AlwaysDepth)

let kuiper = new Kuiper(
  -0.35,
  'Kuiper Belt',
  4000,
  meteourTexture,
  AlwaysDepth,
)

let kuiper2 = new Kuiper(
  0.75,
  'Kuiper Belt',
  4000,
  meteourTexture,
  AlwaysDepth,
)

let oort = new CloudOort('Oort Cloud', 15000, meteourTexture,NoBlending)

const halley = new Comet(
  5e-5,
  null,
  418.42,
  162,
  -2.83,
  2.66e-4,
  0.9854,
  0.967,
  1.955,
  1.036,
  'Halley'
);




const bodies = {
  whitehole: whiteHole,
  sargitarius: sargitariusA,
  sun: sun,
  mercury: mercury,
  venus: venus,
  earth: earth,
  mars: mars,
  jupiter: jupiter,
  saturn: saturn,
  uranus: uranus,
  neptune: neptune,
  pluto: pluto,
  moon: moon,
  europa: europa,
  callisto: callisto,
  ganymede: ganymede,
  iO: iO,
  dione: dione,
  iapetus: iapetus,
  titan: titan,
  rhea: rhea,
  halley:halley
}

export const particles = {
  belt: belt,
  kuiper: kuiper,
  kuiper2: kuiper2,
  oort: oort,
  galaxy: galaxy,
}



let commands = new GuiInterface(particles, camera)

let controls = commands.controls

var clock = new Clock()

function applyDistortion(hole) {
  hole.distortion.hole.mesh.lookAt(camera.position)
  const screenPosition = new Vector3(hole.pos.x, hole.pos.y, hole.pos.z)
  screenPosition.project(camera)
  screenPosition.x = screenPosition.x * 0.5 + 0.5
  screenPosition.y = screenPosition.y * 0.5 + 0.5
  sceneManager.composition.plane.material.uniforms.uConvergencePosition.value.set(
    screenPosition.x,
    screenPosition.y,
  )
  var angle = Math.atan2(
    -camera.position.z + hole.pos.z,
    -camera.position.x + hole.pos.x,
  )
  angle = MathUtils.radToDeg(angle)
  hole.distortion.disc.material.uniforms.angle.value = angle

  renderer.render(hole.distortion.scene, camera)

  renderer.setRenderTarget(sceneManager.composition.defaultRenderTarget)
  renderer.setClearColor('#130e16')
  renderer.render(scene, camera)
  renderer.setRenderTarget(null)

  renderer.setRenderTarget(sceneManager.composition.distortionRenderTarget)
  renderer.setClearColor('#000000')
  renderer.render(hole.distortion.scene, camera)
  renderer.setRenderTarget(null)
}

let time = 0

function bodiesLabel() {
  for (let key in bodies) {
    bodies[key].setLabelVisible(camera, controls.labVisible)
  }
}

function updateBody(body, time, speed, controls, camera) {
  if (body.orbitRadius) {
    updateOrbitingBody(body, time, controls);
  } else {
    updateNonOrbitingBody(body, speed, controls, camera);
  }
}

function updateOrbitingBody(body, time, controls) {
  const R = body.orbitRadius;
  const H = body.orbitInclin;
  const speedObj = time *body.speedTrans


  body.centerOrbit()
  const posCurrent = orbit(
    R,
    H,
    body.eccentricity,
    speedObj,
    body.position.x,
    body.position.y,
    body.position.z,
    body.ia,
    body.ifreq,
    body.ra,
    body.rfreq,
    body.precession
  );
  body.mesh.position.set(posCurrent.x, posCurrent.y, posCurrent.z);
  body.animate(speedObj)

  body.mesh.rotation.y = time * body.speedRot;

  body.orbit.visible = controls.orbitLine;


 
}



function updateNonOrbitingBody(body, speed, controls, camera) {
  let speedLim = Math.max(4e6, Math.min(speed, 2e8))
  body.material.uniforms.uTime.value += speedLim* body.speedDisk;
  body.applyGrav(controls.gravity, camera);
}

function updateParticles(particles, speed, posSun, camera, controls, distSun) {
  Object.keys(particles).forEach(group => {
    const particleGroup = particles[group];
    particleGroup.element.setLabelVisible(posSun, camera, controls.labVisible);

    particleGroup.centerOrbit()
    animateParts(
      particleGroup.pos,
      particleGroup,
      speed,
      particleGroup.maxSpeed,
      particleGroup.minSpeed
    );
    particleGroup.element.pointMaterial.uniforms.time.value += speed * Math.PI * particleGroup.inclSpeed;
    if (!particleGroup.starTexture) {
      particleGroup.element.pointMaterial.uniforms.opacity.value = Math.max(0.1, Math.min(1, distSun / particleGroup.R));
    }
  });
}

function updateNebula(nebula, brightness) {
  nebula.element.pointMaterial.uniforms.opacity.value = calculateOpacity(camera, galaxyCenter, galaxyNormal)*brightness;
}

function updateCameraAndDistortion(controls, camera, posHoleBlack, posHoleWhite) {
  const distHole = camera.position.distanceTo(posHoleBlack);
  const distHoleWhite = camera.position.distanceTo(posHoleWhite);
  updateNebula(nebula, controls.nebulaBrightness);

  commands.followCam(bodies[controls.camTarget], camera);

  if (distHoleWhite >= distHole) {
    applyDistortion(sargitariusA);
  } else {
    applyDistortion(whiteHole);
  }
}
let speed
function animate() {


  speed = commands.timeUnits[controls.timeUnit]
   
  time += clock.getDelta() *speed;

  sun.mesh.getWorldPosition(posSun);

  Object.keys(bodies).forEach(key => {
    updateBody(bodies[key], time, speed, controls, camera);
  });


  halley.tail.animate(posSun)

  sun.update(clock, renderer);

  let distSun = camera.position.distanceTo(posSun)

  updateParticles(particles, speed, posSun, camera, controls,distSun );

  animateParts(nebula.pos, nebula, speed, nebula.maxSpeed, nebula.minSpeed);

  camera.updateWorldMatrix();
  updateCameraAndDistortion(controls, camera, posHoleBlack, posHoleWhite);

  bodiesLabel()

  const closerObj = findClosestBody(camera, bodies);
  updateCamFor(controls, bodies[controls.camTarget], camera, closerObj.minDist);

  if (bodies[closerObj.labCloser].orbitRadius) {
    bodies[closerObj.labCloser].detectCollision(camera);
  }

  
  renderer.render(sceneManager.composition.scene, sceneManager.composition.camera);
  sceneManager.labelRenderer.render(scene, camera);

  commands.stats.update()
}

renderer.setAnimationLoop(animate);
