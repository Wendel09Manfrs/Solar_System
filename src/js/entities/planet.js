import {
  Vector3,
  ShaderMaterial,
  SphereGeometry,
  Mesh,
  TextureLoader,
  AdditiveBlending,
  FrontSide,
  DoubleSide,
  MeshBasicMaterial,
  RingGeometry
} from 'three';

import { Entity } from './entity.js';
import { sun, scene } from '../script';
import fragmentAround from '../../../shaders/atmAround/fragment.glsl';
import vertexAround from '../../../shaders/atmAround/vertex.glsl';

export class Planet extends Entity {
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
    color1atm,
    color2atm,
    ring
  ) {
    const position = new Vector3();
    super(position, size, texture, orbitRadius, inclinRot, orbitInclin, speedTrans, speedRot, eccentricity, label);

    this.ring = ring;
    this.color1atm = color1atm;
    this.color2atm = color2atm;
    this.textureLoader = new TextureLoader();

    if (this.ring) {
      const ringTexture = this.textureLoader.load(this.ring.texture);
      this.ringMesh = this.createRings(this.ring.innerRadius, this.ring.outerRadius, ringTexture);
      this.mesh.add(this.ringMesh);
      this.ringMesh.rotation.x = -0.5 * Math.PI;
    }

    this.matAround = new ShaderMaterial({
      transparent: true,
      uniforms: {
        color1: { value: this.color1atm },
        color2: { value: this.color2atm }
      },
      vertexShader: vertexAround,
      fragmentShader: fragmentAround,
      blending: AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      side: FrontSide
    });

    this.geoAround = new SphereGeometry(this.size * 1.32, 64, 64);
    this.meshAround = new Mesh(this.geoAround, this.matAround);
    scene.add(this.meshAround);
    this.mesh.add(this.meshAround);
  }

  centerOrbit() {
    this.position = sun.mesh.position;
    this.orbit.position.copy(sun.mesh.position);
  }

  createRings(innerRadius, outerRadius, texture) {
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
      color: 0xffffff,
      transparent: true,
      depthTest: true,
      depthWrite: false
    });

    const geometry = new RingGeometry(innerRadius, outerRadius, 128);
    const pos = geometry.attributes.position;
    const v3 = new Vector3();

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      geometry.attributes.uv.setXY(i, v3.length() < 1.2 * innerRadius ? 0 : 1, 1);
    }

    return new Mesh(geometry, material);
  }
}
