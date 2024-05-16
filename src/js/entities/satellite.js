import { Entity } from './entity.js'

export class Satellite extends Entity {
    constructor(
      position,
      size,
      texture,
      radiusOrbit,
      inclinRot,
      inclinOrbit,
      velTrans,
      velRot,
      excentricidade,
      label,
      planet,
    ) {
  
      super(position, size, texture, radiusOrbit, inclinRot, inclinOrbit, velTrans, velRot, excentricidade, label);
  
      this.planet = planet
      this.planet.add(this.mesh)
      this.planet.add(this.orbit)
    }

  }