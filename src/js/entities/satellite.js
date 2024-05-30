import { Entity } from './entity.js'

import { Vector3} from 'three'


export class Satellite extends Entity {
    constructor(
      size,
      texture,
      orbitRadius,
      inclinRot,
      orbitInclin,
      speedTrans,
      speedRot,
      eccentricity,
      label,
      planet
    ) {
      let position = new Vector3()
      super(position, size, texture, orbitRadius, inclinRot, orbitInclin, speedTrans, speedRot, eccentricity, label);
      this.planet = planet
    }
    centerOrbit(){
      this.position = this.planet.mesh.position
      this.orbit.position.copy(this.planet.mesh.position)
    }

  }