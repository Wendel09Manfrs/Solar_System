import {
  Scene,
  TextureLoader,
  Vector3,
  CanvasTexture,
  PointLight,
  Color,
  SphereGeometry,
  ShaderMaterial,
  TorusGeometry,
  Mesh,
  Quaternion,
  WebGLCubeRenderTarget,
  CubeCamera,
  DoubleSide,
  AdditiveBlending,
  LinearMipmapLinearFilter,
  RGBFormat,
  Vector4,
  FrontSide,
  BackSide
} from 'three';

import { Entity } from './entity.js';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';

import solReflexTextura from '../../../assets/cenario/hexangle.png';
import solRaiosTextura2 from '../../../assets/cenario/sunFlare.jpg';
import fragmentCube from '../../../shaders/noisesCube/fragment.glsl';
import vertexCube from '../../../shaders/noisesCube/vertex.glsl';
import fragmentAround from '../../../shaders/atmAround/fragment.glsl';
import vertexAround from '../../../shaders/atmAround/vertex.glsl';
import discVertex from '../../../shaders/noisesSun/vertexEruptions.glsl';
import discFragment from '../../../shaders/noisesSun/fragmentEruptions.glsl';

import { scene, sceneManager } from '../script';

export class Star extends Entity {
  constructor(position, size, orbitRadius, inclinRot, orbitInclin, speedTrans, speedRot, eccentricity, label) {
    super(position, size, null, orbitRadius, inclinRot, orbitInclin, speedTrans, speedRot, eccentricity,0,0, label);
    this.eruptionsList = [];
    this.eruptionsInclin = [];
    this.pos = position;

    this.addTexture();
    this.createGradient();
    this.initElements(scene);
  }

  createGradient() {
    this.gradient = {};
    this.gradient.canvas = document.createElement('canvas');
    this.gradient.canvas.width = 1;
    this.gradient.canvas.height = 128;
    this.gradient.context = this.gradient.canvas.getContext('2d');
    this.gradient.style = this.gradient.context.createLinearGradient(0, 0, 0, this.gradient.canvas.height);

    this.gradient.style.addColorStop(0, '#ff9a00');
    this.gradient.style.addColorStop(0.2, '#ff6600');
    this.gradient.style.addColorStop(0.4, '#220000');
    this.gradient.style.addColorStop(0.6, '#ffda00');
    this.gradient.style.addColorStop(0.8, '#220000');

    this.gradient.context.fillStyle = this.gradient.style;
    this.gradient.context.fillRect(0, 0, this.gradient.canvas.width, this.gradient.canvas.height);
    this.gradient.texture = new CanvasTexture(this.gradient.canvas);
  }

  initElements(scene) {
    this.pointLight = new PointLight(0xffffff, 3.5, 1300, 2e-2);
    this.pointLight.position.copy(this.mesh.position);
    this.mesh.add(this.pointLight);
    scene.add(this.pointLight);

    this.matAround = new ShaderMaterial({
      transparent: true,
      uniforms: {
        color1: { value: new Color(0xfff521) },
        color2: { value: new Color(0xff5567) },
      },
      vertexShader: vertexAround,
      fragmentShader: fragmentAround,
      blending: AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      side: DoubleSide,
    });

    this.geoAround = new SphereGeometry(this.size * 1.5, 64, 64);
    this.meshAround = new Mesh(this.geoAround, this.matAround);
    scene.add(this.meshAround);
    this.mesh.add(this.meshAround);

    this.materialEruptions = new ShaderMaterial({
      vertexShader: discVertex,
      fragmentShader: discFragment,
      uniforms: {
        uTime: { value: 0 },
        uGradientTexture: { value: this.gradient.texture },
        uNoisesTexture: { value: sceneManager.noises.renderTarget.texture },
      },
      transparent: true,
      blending: AdditiveBlending,
      //depthWrite: true,
      depthTest: true,
      side: BackSide,
    });

    this.createEruptions(50, this.materialEruptions);

    this.lensFlare = new Lensflare();
    this.lensFlare.position.copy(this.meshAround.position);

    this.textureLoaderFlare = new TextureLoader(loading.loadingManager);
    this.textureFlare1 = this.textureLoaderFlare.load(solRaiosTextura2);
    this.textureFlare2 = this.textureLoaderFlare.load(solReflexTextura);

    this.lensFlare.addElement(new LensflareElement(this.textureFlare1, 60, 0, new Color(0xffffff)));
    this.lensFlare.addElement(new LensflareElement(this.textureFlare2, 30, 0.4));

    scene.add(this.lensFlare);
    this.updateElementsPosition();
  }

  fibonacciSphere(n, radius) {
    const points = [];
    const offset = 2 / n;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < n; i++) {
      const y = ((i * offset) - 1) + (offset / 2);
      const r = Math.sqrt(1 - y * y);
      const phi = ((i + 1) % n) * increment;

      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      points.push(new Vector3(x * radius, y * radius, z * radius));
    }

    return points;
  }

  createEruptions(n, materialEruptions) {
    const points = this.fibonacciSphere(n, this.size);

    points.forEach((point) => {
      const meshEruption = this.createEruptionMesh(materialEruptions);
      this.setPositionAndRotation(meshEruption, point);
      this.eruptionsInclin.push(this.getRandomInclination());

      this.addMeshToScene(meshEruption);
      this.eruptionsList.push(meshEruption);
    });
  }

  createEruptionMesh(materialEruptions) {
    const radius = this.getRandomRadius();
    const tube = this.getRandomTube();
    const radialSegments = 64;
    const tubularSegments = 64;

    const geometryEruption = new TorusGeometry(radius, tube, radialSegments, tubularSegments, 2 * Math.PI);
    const meshEruption = new Mesh(geometryEruption, materialEruptions);

    this.scaleMeshRandomly(meshEruption);

    return meshEruption;
  }

  setPositionAndRotation(meshEruption, point) {
    const normal = point.clone().normalize();
    const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), normal);

    meshEruption.position.copy(point);
    meshEruption.setRotationFromQuaternion(quaternion);

    this.randomizeRotation(meshEruption);
  }

  getRandomRadius() {
    return Math.random() * (this.size * 0.05) + this.size * 0.05;
  }

  getRandomTube() {
    return Math.random() * 0.002;
  }

  getRandomInclination() {
    return Math.random() * 0.01 - 0.005;
  }

  scaleMeshRandomly(mesh) {
    mesh.scale.set(Math.random() * 0.6 + 1, Math.random() * 0.8 + 1, Math.random() * 0.6 + 1);
  }

  randomizeRotation(mesh) {
    mesh.rotation.set(
      Math.random() * 3 - 1.5,
      Math.random() * 3 - 1.5,
      Math.random() * 3 - 1.5
    );
  }

  addMeshToScene(mesh) {
    this.scene.add(mesh);
    this.mesh.add(mesh);
  }

  updateElementsPosition() {
    this.pointLight.position.copy(this.mesh.position);
    this.lensFlare.position.copy(this.mesh.position);
  }

  updateLensflare(camera) {
    const distance = camera.position.distanceTo(this.lensFlare.position);
    this.lensFlare.visible = distance <= 1.5e7;
  }

  addTexture() {
    this.sceneCube = new Scene();
    this.cubeRenderTarget1 = new WebGLCubeRenderTarget(256, {
      format: RGBFormat,
      generateMipmaps: true,
      minFilter: LinearMipmapLinearFilter,
      antialias: true,
      logarithmicDepthBuffer: true,
    });

    this.cubeCamera1 = new CubeCamera(0.01, 150, this.cubeRenderTarget1);

    this.matCube = new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new Vector4() },
      },
      vertexShader: vertexCube,
      fragmentShader: fragmentCube,
    });

    this.geoCube = new SphereGeometry(this.size, 64, 64);
    this.meshCube = new Mesh(this.geoCube, this.matCube);

    this.sceneCube.add(this.meshCube);
  }

  update(clock, renderer) {
    this.updateElementsPosition();
    const elapsedTime = clock.getElapsedTime();
    this.cubeCamera1.update(renderer, this.sceneCube);
    this.mat.uniforms.uPerlin.value = this.cubeRenderTarget1.texture;
    this.mat.uniforms.time.value = elapsedTime * 5e-3;
    this.matCube.uniforms.time.value = elapsedTime * 5e-3;

    this.eruptionsList.forEach((eruption, i) => {
      eruption.rotation.z += this.eruptionsInclin[i];
      eruption.rotation.x += 1.1e-2 * this.eruptionsInclin[i];
      eruption.rotation.y += 1.5e-2 * this.eruptionsInclin[i];
      eruption.material.uniforms.uTime.value = elapsedTime * this.eruptionsInclin[i] * 1e2;
    });
  }

  centerOrbit() {
    this.position = this.pos;
  }
}
