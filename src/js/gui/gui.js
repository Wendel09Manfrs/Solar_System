import { Vector3 } from 'three'
import { GUI } from 'lil-gui'
import { updateSize } from '../utils.js'

import Stats from 'stats.js';


export class GuiInterface {
  constructor(particles, camera) {
    this.gui = new GUI()
    this.controls = {
      speedCam: 1,
      speedRotCam: 1,
      camTarget: 'sun',
      orbitLine: false,
      labVisible: false,
      mode: 'orbit',
      scaleKuiper: 1,
      scaleBelt: 1,
      scaleOort: 1,
      scaleStars: 1,
      nebulaBrightness: 1,
      gravity: 2,
      relativeCam: false,
      timeUnit: 'Sec',
    }
    this.timeUnits = {
      Sec: 1e-5,
      Min: 0.0006,
      Hour: 0.036,
      Day: 0.864,
      Week: 6.048,
      Month: 25.92,
      Year: 315.36,
      Decade: 3153.6,
      Century: 31536.0,
      Millennium: 315360.0,
      'Ten millennia': 3153600.0,
      'Hundred millennia': 31536000.0,
      Megaannum: 315360000.0,
    }

    this.gruposDeOpcoes = {
      WhiteHole: 'whitehole',
      BlackHole: 'sargitarius',
      Sun: 'sun',
      Mercury: 'mercury',
      Venus: 'venus',
      Earth: 'earth',
      Mars: 'mars',
      Jupiter: 'jupiter',
      Saturn: 'saturn',
      Uranus: 'uranus',
      Neptune: 'neptune',
      Pluto: 'pluto',
      Moon: 'moon',
      Europa: 'europa',
      Callisto: 'callisto',
      Ganymede: 'ganymede',
      iO: 'iO',
      Dione: 'dione',
      Iapetus: 'iapetus',
      Titan: 'titan',
      Rhea: 'rhea',
      Halley:'halley'
    }

    this.optionsCam = {
      Free: 'freeCamera',
      Orbital: 'orbit',
      Automatic: 'tween',
    }

    this.optionsSize = {
      belt: {
        Real: 1,
        Medium: 50000,
        Large: 100000,
      },
      kuiper: {
        Real: 1,
        Medium: 50000,
        Large: 200000,
      },
      oort: {
        Real: 1,
        Medium: 1000000000,
        Large: 3000000000,
      },
      stars: {
        Real: 1,
        Medium: 25000000,
        Large: 50000000,
      },
    }


this.stats = new Stats()
this.stats.showPanel(1) 
document.body.appendChild(this.stats.dom)

    const astroFolder = this.gui.addFolder('Astro Parameters')
    const cameraFolder = this.gui.addFolder('Camera Parameters')
    const sizeFolder = this.gui.addFolder('Scale of elements')

    this.currentPos = new Vector3()

    this.camPosIni = new Vector3()

    this.prevPos = new Vector3()

    astroFolder
      .add(this.controls, 'timeUnit', Object.keys(this.timeUnits))
      .name('Time Unit(per sec)')
      .onChange(() => {
        this.updateSpeeds()
      })
    astroFolder
      .add(this.controls, 'camTarget', this.gruposDeOpcoes)
      .name('Astro')
      .onChange(() => {
        camera.getWorldPosition(this.camPosIni)
        this.camControl = true
      })

    astroFolder.add(this.controls, 'orbitLine').name('Orbits Visible')
    astroFolder.add(this.controls, 'labVisible').name('Labels Visible')

    cameraFolder.add(this.controls, 'mode', this.optionsCam).name('Mode Camera')

    cameraFolder
      .add(this.controls, 'relativeCam')
      .name('Relative Motion Camera')
      .onChange(() => {
        camera.getWorldPosition(this.camPosIni)

        this.camControl = true
      })
    cameraFolder
      .add(this.controls, 'speedCam', 0, 2)
      .name('Speed')
      .step(0.00001)
    cameraFolder
      .add(this.controls, 'speedRotCam', 0.0001, 5)
      .name('Speed Rotate')
      .step(0.0001)

    sizeFolder
      .add(this.controls, 'scaleBelt', this.optionsSize.belt)
      .name('Scale of Asteroids Belt')
      .onChange(() => {
        updateSize(this.controls.scaleBelt, particles.belt)
      })
    sizeFolder
      .add(this.controls, 'scaleKuiper', this.optionsSize.kuiper)
      .name('Scale of Asteroids Kuiper')
      .onChange(() => {
        updateSize(this.controls.scaleKuiper, particles.kuiper)
        updateSize(this.controls.scaleKuiper, particles.kuiper2)
      })
    sizeFolder
      .add(this.controls, 'scaleOort', this.optionsSize.oort)
      .name('Scale of Asteroids Oort')
      .onChange(() => {
        updateSize(this.controls.scaleOort, particles.oort)
      })
    sizeFolder
      .add(this.controls, 'scaleStars', this.optionsSize.stars)
      .name('Scale of Stars Galaxy')
      .onChange(() => {
        updateSize(this.controls.scaleStars, particles.galaxy)
      })

    sizeFolder
      .add(this.controls, 'nebulaBrightness', 0, 1)
      .name('Brightness of Nebula')
      .step(0.001)

    sizeFolder
      .add(this.controls, 'gravity', 0, 5)
      .name('Gravity Holes')
      .step(0.001)

    this.gui.close()
  }

  updateSpeeds() {
    const timeUnitMultiplier = this.timeUnits[this.controls.timeUnit]
    this.controls.transSpeed = timeUnitMultiplier
    this.controls.rotSpeed = timeUnitMultiplier
  }

  followCam(obj, camera) {
    if (this.controls.relativeCam) {
      obj.mesh.getWorldPosition(this.currentPos)

      const movDelt = this.currentPos.clone().sub(this.prevPos)
      camera.position.add(movDelt)

      this.prevPos = this.currentPos.clone()

      if (this.camControl) {
        camera.position.set(
          this.camPosIni.x,
          this.camPosIni.y,
          this.camPosIni.z,
        )
        this.camControl = false
      }
    }
  }

}

