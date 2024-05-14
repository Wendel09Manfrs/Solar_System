import * as THREE from 'three'
import { Entity } from './entity.js'

import { sun } from '../script.js'

export class Planet extends Entity {
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
      ring,
    ) {
      super(position,size, texture, radiusOrbit, inclinRot, inclinOrbit, velTrans, velRot, excentricidade, label);
  
      this.ring = ring;
  
      if (this.ring) {
        let texture = this.textureLoader.load(this.ring.texture)
        this.ringMesh = createRings(this.ring.innerRadius, this.ring.outerRadius, texture)
        this.mesh.add(this.ringMesh);
        this.ringMesh.rotation.x = -0.5 * Math.PI;
      }
      sun.mesh.add(this.mesh)
      sun.mesh.add(this.orbit)
    }
  }

  function createRings(innerRadius, outerRadius, texture) {
  
    const material = new THREE.MeshBasicMaterial({
      map: texture ,
      side: THREE.DoubleSide,
      color: 0xffffff,
      transparent: true,
      depthTest: true,
      depthWrite: true,

      
    });

    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    var pos = geometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      geometry.attributes.uv.setXY(i, v3.length() < 1.2*innerRadius ? 0 : 1, 1);
    }
  
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
