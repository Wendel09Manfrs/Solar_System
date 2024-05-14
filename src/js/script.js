import {
  MathUtils,
  Vector3,
  AdditiveBlending,
  Clock,
  NormalBlending,
} from 'three'

import { Planet } from './entities/planet'
import { Satellite } from './entities/satellite'
import { Star } from './entities/star'

import { BlackHole } from './entities/blackHole.js'
import { WhiteHole } from './entities/whiteHole.js'

import { commands } from './gui/gui'

import { Nebula } from './groupsEntities/nebula.js'
import { Galaxy } from './groupsEntities/galaxy.js'
import { Belt } from './groupsEntities/asteroidsBelt.js'
import { Kuiper } from './groupsEntities/asteroidsKuiper.js'
import { CloudOort } from './groupsEntities/cloudOort.js'

import { atualizarCameraParaAstro } from './utils.js'

import sunTexture from '../../assets/textures/sun.jpg'

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
import { curva, anima } from './utils.js'

export const sceneManager = new SceneManager()
sceneManager.init()

export let controls = commands.controls

var renderer = sceneManager.renderer
export let scene = sceneManager.scene
var camera = sceneManager.camera

camera.add(sceneManager.noises.plane.mesh)

const distSargitarius = (-26000 * 63241.1 * 2.34117) / 5

const velSun = -1.016846e-6 / Math.sqrt(-distSargitarius, 2)

export const sun = new Star(
  new Vector3(distSargitarius, 0, 0),
  1.0929e-1,
  sunTexture,
  distSargitarius,
  0,
  -1.05068821,
  velSun,
  2.916846e-6,
  0,
  'Sun',
)
const posHoleBlack = new Vector3(distSargitarius, 0, 0)
const sargitariusA = new BlackHole(3.7654, 'Sargitarius A*', posHoleBlack)

let posInitial = new Vector3(0, 0, 0)
const mercury = new Planet(
  posInitial,
  3.83e-4,
  mercuryTexture,
  9.09058,
  0.034,
  0.05899213,
  8.264e-7,
  1.240013441242619e-6,
  0.2056,
  'Mercury',
)

const venus = new Planet(
  posInitial,
  9.5e-4,
  venusTexture,
  16.986,
  177.4,
  0.067369,
  3.232e-7,
  2.99259e-7,
  0.0068,
  'Venus',
)

const earth = new Planet(
  posInitial,
  1e-3,
  earthTexture,
  23.47116,
  23.44,
  0.12487831,
  1.992e-7,
  7.29211505392569e-5,
  0.0167,
  'Earth',
)
const moon = new Satellite(
  posInitial,
  2.73e-4,
  moonTexture,
  6.0335e-2,
  6.687,
  0.0898,
  2.661699538941653e-6,
  2.661699538941653e-6,
  0.0549,
  'moon',
  earth.mesh,
)

const mars = new Planet(
  posInitial,
  5.32e-4,
  marsTexture,
  35.743,
  25.19,
  0.0986111,
  1.059e-7,
  7.088218127178316e-5,
  0.0934,
  'Mars',
)
const jupiter = new Planet(
  posInitial,
  1.12e-2,
  jupiterTexture,
  122.153,
  3.12,
  0.1062906,
  1.673e-8,
  1.773408215404907e-4,
  0.0484,
  'Jupiter',
)

const saturn = new Planet(
  posInitial,
  9.45e-3,
  saturnTexture,
  224.107,
  26.73,
  0.09616764,
  9.294e-9,
  1.636246173744684e-4,
  0.0541,
  'Saturn',
  {
    innerRadius: 1.288e-2,
    outerRadius: 2.1e-2,
    texture: ringSaturnTexture,
  },
)
const uranus = new Planet(
  posInitial,
  3.98e-3,
  uranusTexture,
  450.523,
  97.77,
  0.1130973,
  2.37e-9,
  -1.041365902144588e-4,
  0.0472,
  'Uranus',
  {
    innerRadius: 5.96e-3,
    outerRadius: 7.29e-3,
    texture: ringUranusTexture,
  },
)

const neptune = new Planet(
  posInitial,
  3.85e-3,
  neptuneTexture,
  706.657,
  28.32,
  0.1122247,
  1.208e-9,
  1.083382527619075e-4,
  0.0086,
  'Neptune',
)
const pluto = new Planet(
  posInitial,
  1.9e-4,
  plutoTexture,
  927.7436,
  119.61,
  0.29917997705,
  8.01e-10,
  -1.295641039282477e-5,
  0.2488,
  'Pluto',
)

const europa = new Satellite(
  posInitial,
  2.45e-4,
  europaTexture,
  1.0538e-1,
  0.0174533,
  0.00820304748,
  2.053433773e-5,
  2.053715175e-5,
  0.0094,
  'Europa',
  jupiter.mesh,
)

const callisto = new Satellite(
  posInitial,
  3.78e-4,
  callistoTexture,
  2.9595e-1,
  0,
  0.0033510322,
  4.369409e-6,
  4.369445e-6,
  0.0074,
  'Callisto',
  jupiter.mesh,
)
const ganymede = new Satellite(
  posInitial,
  4.13e-4,
  ganymedeTexture,
  1.6848e-1,
  0.005759587,
  0.00349066,
  1.019227339e-5,
  1.019227339e-5,
  0.0013,
  'Ganymede',
  jupiter.mesh,
)
const iO = new Satellite(
  posInitial,
  2.86e-4,
  iOTexture,
  6.623e-2,
  0,
  0.0008726646,
  4.1218468e-5,
  4.12923544e-5,
  0.004,
  'iO',
  jupiter.mesh,
)

const dione = new Satellite(
  posInitial,
  8.821e-5,
  dioneTexture,
  5.931e-2,
  0,
  0.00033161256,
  2.6643556e-5,
  2.66446227e-5,
  0.022,
  'Dione',
  saturn.mesh,
)
const iapetus = new Satellite(
  posInitial,
  1.15e-4,
  iapetusTexture,
  5.5943e-1,
  0,
  0.27000244,
  9.19317e-7,
  9.195605e-7,
  0.0281,
  'Iapetus',
  saturn.mesh,
)
const rhea = new Satellite(
  posInitial,
  1.2e-4,
  rheaTexture,
  8.286e-2,
  0,
  0.0060213859,
  1.6139382e-5,
  1.6139940997e-5,
  0.002583,
  'Rhea',
  saturn.mesh,
)
const titan = new Satellite(
  posInitial,
  4.06e-4,
  titanTexture,
  1.9205e-1,
  0,
  0.0060737,
  4.967795e-6,
  4.967795e-6,
  0.0288,
  'Titan',
  saturn.mesh,
)

const posHoleWhite = new Vector3(
  Math.random() * 2 * distSargitarius - 2 * distSargitarius,
  Math.random() * 2 * distSargitarius - distSargitarius,
  Math.random() * 1e2,
)

const whiteHole = new WhiteHole(3.7654, 'White Hole', posHoleWhite)

let galaxy = new Galaxy(
  'Milk Way Galaxy',
  30000,
  starsTexture,
  AdditiveBlending,
)

let nebula = new Nebula(null, 3000, AdditiveBlending)

let belt = new Belt('Asteroid Belt', 3000, meteourTexture, NormalBlending)

let kuiper = new Kuiper(
  -0.45,
  'Kuiper Belt',
  2000,
  meteourTexture,
  NormalBlending,
)

let kuiper2 = new Kuiper(
  0.55,
  'Kuiper Belt',
  2000,
  meteourTexture,
  NormalBlending,
)

let oort = new CloudOort('Oort Cloud', 20000, meteourTexture, NormalBlending)

let astros = {
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
}

export const particles = {
  belt: belt,
  kuiper: kuiper,
  kuiper2: kuiper2,
  oort: oort,
  galaxy: galaxy,
}

var clock = new Clock()

function distortionHole(hole) {
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

let tempo = 0

function animate() {
  tempo += controls.velocidadeTr
  sargitariusA.material.uniforms.uTime.value = -tempo * 1e-9

  whiteHole.material.uniforms.uTime.value = tempo * 1e-9

  for (let astro in astros) {
    astros[astro].labelVisible(camera, controls.labVisibility)

    if (!(astro === 'sargitarius' || astro === 'whitehole')) {
      const R = astros[astro].radiusOrbit
      const H = astros[astro].inclinOrbit

      const posicao = curva(
        R,
        H,
        astros[astro].excentricidade,
        tempo,
        astros[astro].velTrans,
        astros[astro].position.x,
        astros[astro].position.y,
        astros[astro].position.z,
      )
      astros[astro].mesh.position.set(posicao.x, posicao.y, posicao.z)

      astros[astro].mesh.rotateY(controls.velocidadeRo * astros[astro].velRot)

      astros[astro].orbit.visible = controls.orbitLine
    }
  }

  let posSun = new Vector3()
  sun.mesh.getWorldPosition(posSun)

  const distSun = camera.position.distanceTo(posSun)
  const distHole = camera.position.distanceTo(posHoleBlack)
  const distHoleWhite = camera.position.distanceTo(posHoleWhite)

  const distMinima = Math.min(distSun, distHole, distHoleWhite)
  const normalizedDist = Math.min(0.2, Math.max(5e-3, distMinima / 5e9))
  nebula.element.pointMaterial.uniforms.opacity.value = Math.min(
    normalizedDist,
    controls.brightNebula,
  )

  sargitariusA.applyGravitation(controls.intGrav, camera, posHoleWhite)
  whiteHole.applyGravitation(controls.intGrav,camera)

  let t = clock.getElapsedTime() * controls.velocidadeTr

  for (let group in particles) {
    if (particles.hasOwnProperty(group)) {
      particles[group].element.labelVisible(
        posSun,
        camera,
        controls.labVisibility,
      )

      anima(
        particles[group].pos,
        particles[group],
        controls.velocidadeTr,
        particles[group].velMax,
        particles[group].velMin,
      )
      particles[group].element.pointMaterial.uniforms.time.value =
        t * Math.PI * particles[group].velIncli
    }
  }
  anima(nebula.pos, nebula, controls.velocidadeTr, 7e-7, 6e-7)

  camera.updateWorldMatrix()

  if (distHoleWhite >= distHole) {
    distortionHole(sargitariusA)
  } else {
    distortionHole(whiteHole)
  }

  atualizarCameraParaAstro(astros[controls.astroCam], camera)
  renderer.render(
    sceneManager.composition.scene,
    sceneManager.composition.camera,
  )
  sceneManager.labelRenderer.render(scene, camera)

  //sun
  sun.update(camera, clock, renderer)
}
renderer.setAnimationLoop(animate)
