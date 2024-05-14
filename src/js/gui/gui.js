import { GUI } from 'lil-gui'

import { updateSize } from '../utils.js'

import { particles } from '../script.js'

export class GuiInterface {
  constructor() {
    this.gui = new GUI()
    this.controls = {
      velocidadeTr: 0,
      velocidadeRo: 0,
      velCam: 50000000,
      velRotCam: 1,
      astroCam: 'sun',
      orbitLine: false,
      labVisibility: false,
      mode: 'orbit',
      scaleKuiper: 1,
      scaleBelt: 1,
      scaleOort: 1,
      scaleStars: 1,
      scaleNebulas: 1,
      brightNebula: 0.1,
      intGrav: 0.2,
    }

    this.gruposDeOpcoes = {
      WhiteHole: 'whitehole',
      BlackHole: 'sargitarius',
      Sun: 'sun',
      Mercury: 'mercury',
      Vênus: 'venus',
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
        Medium: 25000,
        Large: 50000,
      },
    }

    const astroFolder = this.gui.addFolder('Astro Parameters')
    const cameraFolder = this.gui.addFolder('Camera Parameters')
    const sizeFolder = this.gui.addFolder('Scale of elements')

    astroFolder
      .add(this.controls, 'velocidadeTr', 0, 10000000)
      .name('Orbital Velocity')
      .step(0.00001)
    astroFolder
      .add(this.controls, 'velocidadeRo', 0, 1000000)
      .name('Rotation Velocity')
      .step(0.0000001)
    astroFolder
      .add(this.controls, 'astroCam', this.gruposDeOpcoes)
      .name('Astro')

    astroFolder.add(this.controls, 'mode', this.optionsCam).name('Mode Camera')

    astroFolder.add(this.controls, 'orbitLine').name('Orbits Visible')
    astroFolder.add(this.controls, 'labVisibility').name('Labels Visible')

    cameraFolder
      .add(this.controls, 'velCam', 0, 1000000000)
      .name('Velocity')
      .step(0.0000001)
    cameraFolder
      .add(this.controls, 'velRotCam', 0.0001, 5)
      .name('Velocity Rotate')
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
      .add(this.controls, 'brightNebula', 5e-3, 0.2)
      .name('Brightness of Nebula')
      .step(0.0001)

    sizeFolder
      .add(this.controls, 'intGrav', 0.1, 1)
      .name('Gravity Holes')
      .step(0.0001)

    this.gui.close()
  }
}

export let commands = new GuiInterface()
