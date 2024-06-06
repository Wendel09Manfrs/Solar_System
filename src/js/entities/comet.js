import {
  Vector3
} from 'three';

import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Entity } from './entity.js';
import { sun, scene } from '../script.js';

import { Tail } from '../groupsEntities/tailCometHalley.js'

export class Comet extends Entity {
  constructor(
    size,
    texture,
    orbitRadius,
    inclinRot,
    orbitInclin,
    speedTrans,
    speedRot,
    eccentricity,
    argPeriapsis,
    longAscNode,
    label
  ) {
    const position = new Vector3();
    super(position, size, texture, orbitRadius, inclinRot, orbitInclin, speedTrans, speedRot, eccentricity,argPeriapsis,longAscNode, label);

    const blend = new URL('../../../assets/textures/halley.glb',import.meta.url)

    const assetLoader = new GLTFLoader();


    const mesh = this.mesh


    this.tail = new Tail(
      this.mesh,
      1600, 
      scene
    )
    
    assetLoader.load(blend.href,function(gltf){
      var model = gltf.scene;

      scene.add(model);
      model.position.set(0,0,0)

      model.scale.set(1.72e-7, 1.72e-7, 1.72e-7);

      mesh.add(model)
    },undefined,function(error){
      console.error(error);
    
    });

  }

  centerOrbit() {
    this.position = sun.mesh.position;
    this.orbit.position.copy(sun.mesh.position);
  }


}
